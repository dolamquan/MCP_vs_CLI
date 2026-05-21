import {
  AgentActionProfile,
  AgentConfidence,
  AgentExecutionPolicy,
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

const getFailedActions = (
  actions: AgentActionProfile[]
): AgentActionProfile[] => {
  return actions.filter((action) => action.status === "failed");
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
  successfulActionCount: number,
  failedActionCount: number
): AgentConfidence => {
  if (successfulActionCount === 0) {
    return "low";
  }

  if (successfulActionCount === 1 && failedActionCount > 0) {
    return "medium";
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
  difference: AgentRecommendationDifference,
  failedActions: AgentActionProfile[]
): string => {
  if (!recommendedAction) {
    return "No candidate action completed successfully.";
  }

  if (!secondBestAction && failedActions.length > 0) {
    return `Action "${recommendedAction.id}" was selected because it was the only candidate that completed successfully. ${failedActions.length} candidate action(s) failed.`;
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
  difference: AgentRecommendationDifference,
  failedActions: AgentActionProfile[]
) => {
  if (!recommendedAction) {
    return {
      shouldUseRecommended: false,
      summary:
        "Do not use any candidate action yet. All candidate actions failed during profiling.",
      fallbackActionId: null
    };
  }

  if (!secondBestAction && failedActions.length > 0) {
    return {
      shouldUseRecommended: true,
      summary:
        "Use the only successful action. Avoid the failed candidate actions unless the result is incomplete.",
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

const buildExecutionPolicy = (
  recommendedAction: AgentActionProfile | null,
  secondBestAction: AgentActionProfile | null,
  failedActions: AgentActionProfile[],
  confidence: AgentConfidence,
  difference: AgentRecommendationDifference
): AgentExecutionPolicy => {
  const failedActionIds = failedActions.map((action) => action.id);

  if (!recommendedAction) {
    return {
      primaryActionId: null,
      fallbackActionId: null,
      retryOnFailure: false,
      shouldAvoidFailedActions: true,
      overrideAllowed: true,
      overrideReasons: [
        "All candidate actions failed.",
        "The agent should generate safer or narrower candidate actions.",
        "The agent may ask the user for clarification if the task is ambiguous."
      ],
      failedActionIds,
      policySummary:
        "Do not execute any recommended action because all candidates failed."
    };
  }

  if (!secondBestAction && failedActions.length > 0) {
    return {
      primaryActionId: recommendedAction.id,
      fallbackActionId: null,
      retryOnFailure: false,
      shouldAvoidFailedActions: true,
      overrideAllowed: true,
      overrideReasons: [
        "The primary action returns incomplete output.",
        "The primary action does not answer the task.",
        "A failed action may be retried only with narrower arguments or a safer command."
      ],
      failedActionIds,
      policySummary:
        "Use the only successful action first. Avoid failed actions unless the successful result is incomplete."
    };
  }

  if (!secondBestAction) {
    return {
      primaryActionId: recommendedAction.id,
      fallbackActionId: null,
      retryOnFailure: true,
      shouldAvoidFailedActions: false,
      overrideAllowed: true,
      overrideReasons: [
        "Only one candidate action was available.",
        "The primary action returns incomplete output.",
        "The task requires information not covered by the primary action."
      ],
      failedActionIds,
      policySummary:
        "Use the recommended action. Generate a new fallback if it fails or produces incomplete output."
    };
  }

  if (confidence === "high") {
    return {
      primaryActionId: recommendedAction.id,
      fallbackActionId: secondBestAction.id,
      retryOnFailure: true,
      shouldAvoidFailedActions: failedActions.length > 0,
      overrideAllowed: true,
      overrideReasons: [
        "The primary action fails.",
        "The primary action returns incomplete output.",
        "The fallback provides better semantic structure or reliability despite higher token cost."
      ],
      failedActionIds,
      policySummary:
        "Use the recommended action first. Use the fallback only if the primary action fails or gives incomplete output."
    };
  }

  if (confidence === "medium") {
    return {
      primaryActionId: recommendedAction.id,
      fallbackActionId: secondBestAction.id,
      retryOnFailure: true,
      shouldAvoidFailedActions: failedActions.length > 0,
      overrideAllowed: true,
      overrideReasons: [
        "The fallback is more reliable for this task.",
        "The primary action gives incomplete output.",
        "The token savings are moderate, so quality may justify using the fallback."
      ],
      failedActionIds,
      policySummary:
        "Use the recommended action first, but the fallback is also reasonable if output quality matters."
    };
  }

  return {
    primaryActionId: recommendedAction.id,
    fallbackActionId: secondBestAction.id,
    retryOnFailure: true,
    shouldAvoidFailedActions: failedActions.length > 0,
    overrideAllowed: true,
    overrideReasons: [
      "The token savings are small.",
      "The fallback is more reliable or easier to interpret.",
      "The primary action output is incomplete or noisy."
    ],
    failedActionIds,
    policySummary:
      difference.tokenDifference > 0
        ? "Use the recommended action, but either successful option is acceptable because the savings are small."
        : "The top actions are effectively tied. Choose based on reliability, completeness, or output quality."
  };
};

export const buildAgentRecommendationResponse = (
  task: string,
  actions: AgentActionProfile[]
): AgentRecommendationResult => {
  const successfulActions = getSuccessfulActions(actions);
  const failedActions = getFailedActions(actions);

  if (successfulActions.length === 0) {
    const executionPolicy = buildExecutionPolicy(
      null,
      null,
      failedActions,
      "low",
      {
        tokenDifference: 0,
        percentageSaved: 0,
        costDifference: 0
      }
    );

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
      executionPolicy,
      actions
    };
  }

  const sortedActions = sortActionsByEfficiency(successfulActions);

  const recommendedAction = sortedActions[0];
  const secondBestAction = sortedActions[1] || null;

  const difference = buildDifference(recommendedAction, secondBestAction);

  const confidence = calculateAgentConfidence(
    difference,
    successfulActions.length,
    failedActions.length
  );

  const agentAdvice = buildAgentAdvice(
    recommendedAction,
    secondBestAction,
    confidence,
    difference,
    failedActions
  );

  const executionPolicy = buildExecutionPolicy(
    recommendedAction,
    secondBestAction,
    failedActions,
    confidence,
    difference
  );

  return {
    task,
    recommendedActionId: recommendedAction.id,
    recommendedType: recommendedAction.type,
    reason: buildReason(
      recommendedAction,
      secondBestAction,
      difference,
      failedActions
    ),
    confidence,
    difference,
    agentAdvice,
    executionPolicy,
    actions
  };
};