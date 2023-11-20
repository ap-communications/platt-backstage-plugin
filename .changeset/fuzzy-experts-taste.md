---
'@platt/plugin-search-backend-module-cognitive-search': minor
---

Ensure the document shcemas for storing in cognitive-search

breaking change.
Cognitive search is not able to accept unknown properties of the document. To ensure document will be matched as schema entirely, I added `CognitiveSearchIndexTransformer`. 
Please read the document(README.md) of plugin if you added additional document types.
