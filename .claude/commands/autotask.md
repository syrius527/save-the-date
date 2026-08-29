---
description: Start an autonomous optimization loop (Karpathy autoresearch pattern)
argument-hint: <objective>
---

Load the autotask skill and start an autonomous optimization loop.

**Objective**: $ARGUMENTS

---

## What This Does

The autotask skill implements Karpathy's autoresearch pattern for code optimization:
1. Define a measurable objective and metric command
2. Establish a baseline measurement
3. Run an autonomous loop: hypothesize → implement → measure → keep/discard → repeat
4. The agent runs continuously until you interrupt it

## Setup (Agent Will Guide You)

Before the loop starts, confirm:
- **Metric command**: Shell command that produces the number to optimize
- **Direction**: Lower is better (bundle size, errors) or higher is better (coverage, score)
- **Target files**: Which files the agent can modify
- **Constraints**: What the agent cannot do

## Example Objectives

- `/autotask reduce bundle size`
- `/autotask eliminate type errors`
- `/autotask improve test coverage`
- `/autotask optimize build time`

---

## Instructions

1. Load the **autotask** skill to get the full experiment loop protocol
2. Use the **experiment_start** MCP tool to record the baseline
3. Use the **experiment_record** MCP tool after each experiment iteration
4. Use the **experiment_history** and **experiment_best** MCP tools for reporting
5. Follow the LOOP FOREVER protocol from the skill — do NOT stop until interrupted

---

Please load the autotask skill and begin the autonomous optimization loop for the objective specified above.
