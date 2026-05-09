Extend the existing “CLI vs MCP Token Analyzer” dashboard design by creating four additional pages:

1. Analyze Page
2. Compare Page
3. History Page
4. Settings Page

Important:
Keep the exact same visual theme as the current dashboard:
- black background
- dark glassmorphism cards
- subtle borders
- neon green main accent
- blue/purple secondary accents
- white headings
- gray body text
- left sidebar navigation
- clean developer-tool dashboard style
- monospace text for commands
- minimal, premium, professional layout

Use the same sidebar across all pages:
Logo: “CLI vs MCP”
Menu:
Dashboard
Analyze
Compare
History
Settings

The active page should have a dark rounded highlight like the current Dashboard page.

PAGE 1: ANALYZE

Purpose:
A page where users paste a CLI command or MCP tool call and get token/cost analysis.

Layout:
Top heading:
“Analyze Workflow”

Subheading:
“Paste a command or tool call to estimate token usage, cost, and efficiency.”

Main content:
Create a large input card on the left/top.

Card title:
“Workflow Input”

Fields:
- Workflow Type dropdown: CLI / MCP
- Model dropdown: GPT-4.1 Mini / GPT-4.1 / Claude / Gemini
- Command textarea

Textarea placeholder:
“Paste your CLI command or MCP tool call here…”

Buttons:
- Analyze Workflow
- Clear

Below or beside the input card, create result cards:
- Input Tokens
- Output Tokens
- Total Tokens
- Estimated Cost
- Efficiency Score

Use sample values:
Input Tokens: 890
Output Tokens: 410
Total Tokens: 1,300
Estimated Cost: $0.0029
Efficiency Score: 92%

Add a small recommendation card:
Title:
“Recommendation”

Text:
“This workflow is highly efficient for short command-based tasks.”

Style:
Use neon green for positive metrics.
Use blue or purple for secondary highlights.
Keep all cards dark with subtle glow and thin borders.

PAGE 2: COMPARE

Purpose:
A page where users compare CLI and MCP workflows side by side.

Top heading:
“Compare Workflows”

Subheading:
“Compare CLI commands and MCP tool calls to find the cheaper and more efficient option.”

Main layout:
Create two large side-by-side input panels.

Left card:
Title:
“CLI Workflow”

Textarea placeholder:
“Paste CLI command…”

Sample:
npm run analyze -- --model gpt-4.1

Right card:
Title:
“MCP Workflow”

Textarea placeholder:
“Paste MCP tool call…”

Sample:
mcp.callTool("analyze_project")

Between or below the cards:
Button:
“Compare Workflows”

Results section:
Create a comparison table with columns:
Workflow
Input Tokens
Output Tokens
Total Tokens
Cost
Efficiency

Rows:
CLI
890
410
1,300
$0.0029
92%

MCP
1,320
500
1,820
$0.0041
82%

Add a highlighted insight card:
Title:
“Best Option”

Text:
“CLI is 29% cheaper in this comparison.”

Use a neon green badge:
“Recommended: CLI”

Add a simple cost comparison chart below:
- CLI bar
- MCP bar

Keep it dark, clean, and dashboard-like.

PAGE 3: HISTORY

Purpose:
A page where users see past analyses.

Top heading:
“Analysis History”

Subheading:
“Review previous CLI and MCP token usage results.”

Add top filter controls:
- Search bar: “Search command history…”
- Workflow filter dropdown: All / CLI / MCP
- Model filter dropdown
- Date range dropdown
- Export button

Main table:
Columns:
Date
Workflow
Command Preview
Model
Input Tokens
Output Tokens
Cost
Efficiency

Rows with sample data:
16 Apr, 2026 | CLI | npm run analyze --model gpt-4.1 | GPT-4.1 | 890 | 410 | $0.0029 | 92%
16 Apr, 2026 | MCP | mcp.callTool("analyze_project") | GPT-4.1 Mini | 1,320 | 500 | $0.0041 | 82%
15 Apr, 2026 | CLI | python analyze.py --input data.json | GPT-4.1 Mini | 620 | 336 | $0.0021 | 95%

Add action icons on each row:
- View
- Copy
- Delete

Add summary cards above the table:
- Total Runs
- Average Cost
- Most Efficient Type
- Total Saved

Sample values:
Total Runs: 48
Average Cost: $0.0038
Most Efficient Type: CLI
Total Saved: $18.40

Style:
Dark table, subtle row hover, green efficiency text, blue/purple workflow icons.

PAGE 4: SETTINGS

Purpose:
A page where users configure models, pricing, export format, and app preferences.

Top heading:
“Settings”

Subheading:
“Customize model pricing, export options, and dashboard preferences.”

Create settings sections as dark cards.

Card 1:
Title:
“Default Model”

Fields:
- Default model dropdown: GPT-4.1 Mini / GPT-4.1 / Claude / Gemini
- Default workflow type: CLI / MCP
- Save button

Card 2:
Title:
“Pricing Configuration”

Fields:
- Input cost per 1M tokens
- Output cost per 1M tokens
- Currency dropdown: USD / AUD / VND

Show helper text:
“Used to estimate token cost for each workflow.”

Card 3:
Title:
“Export Preferences”

Options:
- Default export format: JSON / CSV
- Include timestamps toggle
- Include model details toggle
- Include cost breakdown toggle

Card 4:
Title:
“Dashboard Preferences”

Options:
- Save history toggle
- Show efficiency score toggle
- Enable dark glow effects toggle
- Compact mode toggle

Card 5:
Title:
“Danger Zone”

Buttons:
- Clear History
- Reset Settings

Danger zone should use red accent, but keep it subtle and consistent with the dark theme.

GLOBAL REQUIREMENTS:
- All pages must visually match the current dashboard screenshot.
- Keep the same sidebar, spacing, cards, typography, and dark UI system.
- Use neon green for primary actions and positive values.
- Use blue for CLI icons.
- Use purple for MCP icons.
- Use red only for delete or danger actions.
- Use large clean headings.
- Use rounded cards with thin borders.
- Make all pages responsive.
- Keep the design practical and usable, not just decorative.