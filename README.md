*This project has been created as part of the 42 curriculum by rshatra, eperperi, jsamardz, csteudin*

_§-TrancendencE-§_

> Surprise,
>		- its a pong website


# §- DESCRIPTION

**TRANCENDENCE** is a full-stack web application based on the classic Pong game.

The goal of this project was to build a modern, scalable web platform that goes beyond a simple game. It includes real-time gameplay, user management, authentication, tournament systems, and additional features such as AI opponents and security layers.

The project is fully containerized using Docker and designed to run as a modular system with separated frontend, backend, and database services.

## Key Features

- Pong game with real-time interaction
- Tournament system with score tracking
- AI opponent
- User accounts and authentication
- Remote login support
- Two-Factor Authentication (2FA)
- GDPR-aware user handling
- Monitoring system
- Cross-device support

---

# §- INSTRUCTIONS

## Prerequisites

Make sure you have:

- Docker
- Docker Compose
- Make
- stable internet :D

## HOW TO USE

_SETUP_
- run <make setup>
- go to ./docker/.env
	-> fill in the credentials

_USE_
- <make> -> build -> up
- <make build>
- <make up>
- <make down>
- <make re>

- <make clean>
- <make fclean> [ deletes db & .env ]

- <make logs>
- <make logs-f> [ stays in log window ]

_INFO_
<!> make logs for info
[!] make fclean deletes the .env file [!]

---

## §- RESOURCES

_REFERENCES_

Docker Documentation
WebSocket / Real-time communication docs
Authentication & 2FA concepts
Google Cloud documentation
GDPR compliance basics
https://haglobah.github.io/Mastering-42/holy_graph/ft_transcendence.html

_AI USAGE_

AI tools (ChatGPT, Claude) were used for:

Debugging assistance
Concept explanations (auth, docker, architecture)
Structuring parts of the README

AI was mainly used as a support tool.

---

# ADDITIONAL

## §- TEAM-INFORMATION

_rshatra_
Role: Product Manager
Responsibilities: architecture decisions, backend structure, coordination

_eperperi_
Role: Product Owner
Responsibilities: feature planning, requirement validation

_jsamardz_
Role: Developer
Responsibilities: implementation of core features

_csteudin_
Role: Tech Lead
Responsibilities: Deployment structure, support development, testing, integration

---

## §- PROJECT-MANAGEMENT

_Organization_
We had a check in meetings every 1 to 3 weeks, in regular every week.
We communicated via WhatsApp, and Slack .

_Tools_
GitHub (version control, issues)

_Communication_
Whatsapp 	(main communication)
Slack	 	(work dependent communication)
Google Meet (meetings)

---

# TECHNICAL

## $- TECHNICAL-STACK

_Frontend_
- Tailwind CSS
Focus on responsiveness and usability, mostly the design

_Backend_
- Fastify
Handles API, authentication, game logic

_Database_
- sqlite
Chosen for structured data (users, matches, scores)
chosen because of easy and straight forward compatability and usage.

_Other_
- Docker for containerization
- Prometheus & Grafana, with cadvisor (Monitoring of containers)

__Justification__
Docker ensures reproducibility
Frameworks speed up development and enforce structure
Database needed for persistence, and easier maintainence (users, tournaments)
Monitoring for server-sided safety and maintainence

---

## $- DATABASE-SCEME

______________________________________________________________________________________________________
| Field              | Type    | Constraints                  | Description                          |
|--------------------|---------|------------------------------|--------------------------------------|
| id                 | INTEGER | PRIMARY KEY, AUTOINCREMENT   | Unique user ID                       |
| username           | TEXT    | NOT NULL, UNIQUE             | Username                             |
| email              | TEXT    | NOT NULL, UNIQUE             | Email address                        |
| password           | TEXT    |                              | Hashed password (nullable for OAuth) |
| total_games        | INTEGER | DEFAULT 0                    | Total games played                   |
| wins               | INTEGER | DEFAULT 0                    | Total wins                           |
| is_online          | INTEGER | DEFAULT 0                    | Online status (0/1)                  |
| is_oauth           | INTEGER | DEFAULT 0                    | OAuth login flag                     |
| profile_picture    | TEXT    | DEFAULT NULL                 | Profile image path/URL               |
| two_factor_secret  | TEXT    | DEFAULT NULL                 | 2FA secret                           |
| two_factor_enabled | INTEGER | DEFAULT 0                    | 2FA enabled flag                     |
------------------------------------------------------------------------------------------------------

---

## $- FEATURES-LIST

Pong Game			(eperperi)
	- its the game, you know it, its pong, like tabletennis, but more technical. . .
Tournament System	(!HELP)
	- to store the score of the tournaments.
2-Factor-Authentication	(jsamardz)
	- security layer authentication.
Remote Auth				(csteudin)
	- google login, quick and easy account creation.
AI Opponent				(eperperi)
	- makes the tournament playable with multiple users.
GDPR Compliance			(eperperi)
	- website feature for account deletion etc.
Monitoring System		(csteudin)
	- Monitoring website for maintainence

!HELP please add features i am not aware of, and maybe change the names im not shure with this section who did what specifically

---

## §- MODULES

_!_ Major Module == 2;
_!_ Minor Module == 1; 

- 2/ Use a Framework to build the backend;
		!- Faster creation, and library support, obviously efficient to have.	-rshatra
- 1/ Use a Framework or toolkit to build the Frontend;
		!- Nice graphic options, effeciency in creating, obviously nice to have. -old_teammember
- 1/ Use a database for the backend;
		!- Obviously neccesary if we want to do a actual server :D				-rshatra
- 2/ Store the score of the tournament in blockchain;
		!- For Statistics which gives the website a Competetive touch, also nice to learn about.	-jsamardz
- 2/ Standard user management;
		!- Neccesary to have, so we have what an actual website also has.	-eperperi
- 2/ Implement remote authentication;
		!- Nice to have, modern websites always provide something like this.	-csteudin
- 2/ intoduce an ai op;
		!- Important to have for the Tournament.	-eperperi
- 1/ GDPR compliance;
		!- Important for an modern Website.		-!HELP
- 2/ 2FA;
		!- Important for Security reasons.		-jsamardz
- 1/ Monitoring Systema;
		!- Important because of Server maintainance, in real case scenarios.	-csteudin
- 1/ Support on all devices
		!- Important to be supported on a actual Website :D		-!HELP, i think it just worked. . .
-_17_

Modules were chosen to get the experience of developing a Modern Website, remote login, 2fa etc.
*However the Modules were not chosen to completely make the Project a Product.*

---

## $- INDIVIDUAL-CONTRIBUTORS

-__rshatra__ (Product Manager)

_Main Focus_: 

_Challenges & Solutions_:

-----------------------

-__eperperi__ (Product Owner)

_Main Focus_: 

_Challenges & Solutions_:

-----------------------

-__jsamardz__ (Developer)

_Main Focus_: 

_Challenges & Solutions_:

-----------------------

-__csteudin__ (Tech Lead)

_Main Focus_: Infrastructure & Deployment

Project Deployment and structuring.
I Designed Docker setup and container orchestration
Implemented remote authentication (OAuth / Google-login)
Set up monitoring system (Prometheus, Grafana, cAdvisor)
Fixing SQL injections, and XSS.
Supported integration and testing across modules.
README structuring

_Challenges & Solutions_:

Complex Docker setup → One time setup solution;
SQL && XSS → Had to go down the rabbit hole to understand it, but after it clicks you just fix. . . 
