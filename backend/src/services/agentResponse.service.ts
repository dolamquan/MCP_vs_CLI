import {
  AgentActionProfile,
  AgentConfidence,
  AgentRecommendationDifference,
  AgentRecommendationResult
} from "../types/agent.types";

const roundNumber = (value: number, decimals = 6): number => {
  return Number(value.toFixed(decimals));
};

const getSuccessfulActions = (
  actions: AgentActionProfile[]
): AgentActionProfile[] => {
  return actions.filter((action) => action.status === "success");
};

const sortActionsByEfficiency = (
  actions: AgentActionProfile[]
): AgentActionProfile[] => {
  return [...actions].sort((a, b) => {
    if (a.totalTokens !== b.totalTokens) {
      return a.totalTokens - b.totalTokens;
    }

    return a.estimatedCost - b.estimatedCost;
  });
};

const buildDifference = (
  bestAction: AgentActionProfile | null,
  secondBestAction: AgentActionProfile | null
): AgentRecommendationDifference => {
  if (!bestAction || !secondBestAction) {
    return {
      tokenDifference: 0,
      percentageSaved: 0,
      costDifference: 0
    };
  }

  const tokenDifference = Math.max(
    0,
    secondBestAction.totalTokens - bestAction.totalTokens
  );

  const percentageSaved =
    secondBestAction.totalTokens === 0
      ? 0
      : (tokenDifference / secondBestAction.totalTokens) * 100;

  const costDifference = Math.max(
    0,
    secondBestAction.estimatedCost - bestAction.estimatedCost
  );

  return {
    tokenDifference,
    percentageSaved: roundNumber(percentageSaved, 2),
    costDifference: roundNumber(costDifference, 8)
  };
};

export const calculateAgentConfidence = (
  difference: AgentRecommendationDifference,
  successfulActionCount: number
): AgentConfidence => {
  if (successfulActionCount === 0) {
    return "low";
  }

  if (successfulActionCount === 1) {
    return "medium";
  }

  if (difference.percentageSaved >= 40) {
    return "high";
  }

  if (difference.percentageSaved >= 15) {
    return "medium";
  }

  return "low";
};

const buildReason = (
  recommendedAction: AgentActionProfile | null,
  secondBestAction: AgentActionProfile | null,
  difference: AgentRecommendationDifference
): string => {
  if (!recommendedAction) {
    return "No candidate action completed successfully.";
  }

  if (!secondBestAction) {
    return `Only one candidate action completed successfully, so "${recommendedAction.id}" was selected.`;
  }

  if (difference.tokenDifference === 0) {
    return `Action "${recommendedAction.id}" was selected because it tied for the lowest token usage and had the lowest estimated cost.`;
  }

  return `${recommendedAction.type.toUpperCase()} action "${
    recommendedAction.id
  }" used ${difference.tokenDifference} fewer tokens than "${
    secondBestAction.id
  }", saving approximately ${difference.percentageSaved}%.`;
};

const buildAgentAdvice = (
  recommendedAction: AgentActionProfile | null,
  secondBestAction: AgentActionProfile | null,
  confidence: AgentConfidence,
  difference: AgentRecommendationDifference
) => {
  if (!recommendedAction) {
    return {
      shouldUseRecommended: false,
      summary:
        "Do not use any candidate action yet. All candidate actions failed during profiling.",
      fallbackActionId: null
    };
  }

  if (!secondBestAction) {
    return {
      shouldUseRecommended: true,
      summary:
        "Use the recommended action, but confidence is limited because there was no successful alternative to compare against.",
      fallbackActionId: null
    };
  }

  if (confidence === "high") {
    return {
      shouldUseRecommended: true,
      summary: `Use ${recommendedAction.type.toUpperCase()}. It is significantly cheaper for this task.`,
      fallbackActionId: secondBestAction.id
    };
  }

  if (confidence === "medium") {
    return {
      shouldUseRecommended: true,
      summary: `Use ${recommendedAction.type.toUpperCase()}, but the savings are moderate. The fallback action is also reasonable.`,
      fallbackActionId: secondBestAction.id
    };
  }

  return {
    shouldUseRecommended: difference.tokenDifference > 0,
    summary:
      difference.tokenDifference > 0
        ? `Use ${recommendedAction.type.toUpperCase()}, but the savings are small. Either option is acceptable.`
        : "The best options are very close. Choose based on reliability or output quality instead of token cost.",
    fallbackActionId: secondBestAction.id
  };
};

export const buildAgentRecommendationResponse = (
  task: string,
  actions: AgentActionProfile[]
): AgentRecommendationResult => {
  const successfulActions = getSuccessfulActions(actions);

  if (successfulActions.length === 0) {
    return {
      task,
      recommendedActionId: null,
      recommendedType: null,
      reason: "No candidate action completed successfully.",
      confidence: "low",
      difference: {
        tokenDifference: 0,
        percentageSaved: 0,
        costDifference: 0
      },
      agentAdvice: {
        shouldUseRecommended: false,
        summary:
          "No action should be used because all candidate actions failed during profiling.",
        fallbackActionId: null
      },
      actions
    };
  }

  const sortedActions = sortActionsByEfficiency(successfulActions);

  const recommendedAction = sortedActions[0];
  const secondBestAction = sortedActions[1] || null;

  const difference = buildDifference(recommendedAction, secondBestAction);

  const confidence = calculateAgentConfidence(
    difference,
    successfulActions.length
  );

  return {
    task,
    recommendedActionId: recommendedAction.id,
    recommendedType: recommendedAction.type,
    reason: buildReason(recommendedAction, secondBestAction, difference),
    confidence,
    difference,
    agentAdvice: buildAgentAdvice(
      recommendedAction,
      secondBestAction,
      confidence,
      difference
    ),
    actions
  };
};