---
name: choose-model
description: Choose the best model and effort level for a spec. Use when the user runs "/choose-model" or asks which model to use for a feature, spec, or task — especially before executing a prompt. Reads a spec index file and meta/models.md, classifies the task, and returns a concrete recommendation.
---

Read the feature spec passed by the user and `meta/models.md`.

Your only task is to choose the best model/effort for executing this spec. Do not implement anything.

Classify the task by:

- scope
- risk
- ambiguity
- number of files likely affected
- whether it touches auth, permissions, cookies, CORS, database, payments, production, or user data
- whether the task is mechanical, feature-level, refactor-level, or critical

Then return:

1. recommended model
2. acceptable cheaper alternative
3. when to upgrade
4. why
5. what not to use
