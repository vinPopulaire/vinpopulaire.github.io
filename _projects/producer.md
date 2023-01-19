---
layout: page
title: Producer
description: Recommendation system for the PRODUCER Horizon 2020 project
img: assets/img/projects/producer.png
importance: 1
category: Horizon 2020
---

# PeRsOnalized DocUmentary Creation based on Automatically Annotated Content

[Cordis link](https://cordis.europa.eu/project/id/731893)

## Objective

<div class="profile float-right">
    {% include figure.html path="assets/img/projects/producer.png" title="producer image" class="img-fluid rounded z-depth-1" %}
</div>

Recent market research has revealed a globally growing interest on documentaries both from the demand and supply side. Documentary genre has now become the 2nd most populated content-wise genre in the movie titles catalog, surpassing traditionally popular genres such as comedy or adventure films. At the same time modern audiences appear willing to immerse into more interactive and personalised viewing experiences, through second-screen content and advanced video formats such as 360° video. Documentaries, even in their linear version, involve high costs in all phases (pre-production, production, post-production) due to certain inefficiencies, partly attributed to the lack of scientifically-proven cost-effective ICT tools. 

PRODUCER aims at filling this gap, by delivering a set of innovative ICT tools that focus on supporting various stages of the documentary creation process, ranging from the user engagement and audience building, to the final documentary delivery. Apart from the key objective of reducing the overall production cost and time, enabling small documentary production houses (SMEs) to increase their market share and competitiveness, our project would result in: 
a) providing greater creativity and productivity to documentary creation professionals, stimulated by new production sophisticated tools that enable searching, annotating, editing, personalizing professional and user generated content, 
b) enhancing viewers’ experience and satisfaction by generating multi-layered documentaries, and delivering to the viewer personalized services, 
and c) facilitating the promotion of the documentaries to investors. 

The consortium is composed of three SME partners, one broadcaster, one large ICT industry, and two research institutions, all of them actively involved as key actors in offering adequate competence for the accomplishment of the project objectives.

## Social Recommendation and Personalization Tool

[Code](https://github.com/vinPopulaire/SRPtool)

Social Recommendation and Personalization Tool (SRPtool) consists of three main functionalities/mechanisms, as follows:

1. Personalization
2. Relevance Feedback
3. Social Recommendation

Those three main mechanisms are efficiently combined towards delivering personalized information to the end user (either professional or viewer) close to his/her interests, improving end users’ Quality of Experience (QoE) and making the overall PRODUCER toolkit’s usage more appealing. The output of the SRPtool will be the personalized information, which will be offered as appropriately ranked list of multimedia content either to professional users or to the viewers. For the latter, the most relevant content to user’s profile will be ranked higher in the list while for the former higher rank will be assigned to multimedia content that is most relevant to their customers’ characteristics. This personalized information will conclude to significant benefits and profit for the professional users, e.g. production houses, broadcasters, advertising companies, editorial and online publishing companies, etc., as well as it will encourage the usage of the tool by the viewers.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/projects/srptool.png" title="srptool image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Overview of the Social Recommendation and Personalization Tool.
</div>

The main goal of personalization mechanism is to effectively and efficiently satisfy individual needs. By considering end users as individuals, implicit characteristics such as personal taste, age, origin, innate needs and experience become important integral parts of system design. In the literature, personalized user interface has been popular by using implicit data captured in user interactions.

The relevance feedback is utilized by the system to learn users’ specific context that they have in mind for the initial streamed video. More specifically, it should be noticed that starting with the same video, two users could end up with very different enrichments and relevant advertisements paired and shown with the video depending on their feedback which contributes to the update of user’s profile. Thus, the main goal of relevance feedback is to learn a model of user’s interest based on his/her interaction sessions with the system.

The general scope of social recommendation mechanism is to collect and analyze different sources of information considering the preferences of the users with respect to a set of items, aiming to provide rankings and scores on these items tailored to each separate user, in order to facilitate the discovery and selection of items by the end user and improve his / her experience.
