# API Documentation

[👈 Documents](./Readme.md)

## Table of contents

- [API Documentation](#api-documentation)
  - [Table of contents](#table-of-contents)
  - [Base URL](#base-url)
  - [Endpoints](#endpoints)
    - [1. **Health**](#1-health)
    - [2. **Fetch News**](#2-fetch-news)
    - [3. **Create Posts**](#3-create-posts)

## Base URL

Application will be served on port `7002` which is configured on `.env` file.

<https://localhost:7002>

## Endpoints

### 1. **Health**

Retries API health

- **URL**: `/`
- **Complete URL**: `http://localhost:7002`
- **Method**: `GET`
- **Response**:

```json
{
    statusCode: 200,
    data: "API is up and running! 🏃‍♂️"
}
```

### 2. **Fetch News**

Fetches news as per `query` passed and stores fetched data on database and performs recursion unless all data are fetched.

- **URL**: `/webz/fetch`
- **Complete URL**: `http://localhost:7002/webz/fetch`
- **Method**: `GET`
- **Query Parameters**:
- `query` (optional, string): Query to be executed on webz.io -> default:`site_type:(news OR blogs) is_first:true gold$ AND metal AND (trade$ OR volatility$ OR fund$ OR funds$) AND (market$ OR asset$ OR futures OR exchange) AND (forecast OR commodity OR "gold$ price$") AND (traders$ OR trading$ OR equity OR etf OR etfs OR portfolio) title:gold`
- **Response**:
Success:

```json
{
    statusCode: 200,
    data: "Fetch request initiated"
}
```

> 📔 All the posts will be fetched and stored asynchronously thus no response will be sent initially, but when data are fetched and stored a callback function is executed. Thus logs will be shown.

```TypeScript
 const callback = (data: WebzCallbackData) => {
      const remaining =
        data.remaining - data.received < 0 ? data.remaining - data.received : 0;
      //  Perform Call back action as required
      logger.info(
        `DATA : ${data.received} posts received and ${remaining} posts remaining`,
      );
    };
```

### 3. **Create Posts**

Enters the single post

- **URL**: `/webz`
- **Complete URL**: `http://localhost:7002/webz`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**:

```json

{
    "thread": {
        "uuid": "132a1c972d7a5fd8c361f410e5941293556c2ca6",
        "url": "https://trader-magazine.com/news/will-gold-surpass-3000-in-2025-predictions-vary-but-the-reasons-remain-the-same",
        "site_full": "trader-magazine.com",
        "site": "trader-magazine.com",
        "site_section": "https://www.trader-magazine.com",
        "site_categories": [],
        "section_title": "Welcome to Trader-Magazine! Online magazine",
        "title": "Will Gold Surpass $3,000 in 2025? Predictions Vary, But the Reasons Remain the Same.",
        "title_full": "Will Gold Surpass $3,000 in 2025? Predictions Vary, But the Reasons Remain the Same.",
        "published": "2025-01-16T10:50:00.000+02:00",
        "replies_count": 0,
        "participants_count": 0,
        "site_type": "news",
        "country": "US",
        "main_image": "",
        "performance_score": 0,
        "domain_rank": null,
        "domain_rank_updated": null,
        "social": {
            "facebook": {
                "likes": 0,
                "comments": 0,
                "shares": 0
            },
            "vk": {
                "shares": 0
            }
        }
    },
    "uuid": "132a1c972d7a5fd8c361f410e5941293556c2ca6",
    "url": "https://trader-magazine.com/news/will-gold-surpass-3000-in-2025-predictions-vary-but-the-reasons-remain-the-same",
    "ord_in_thread": 0,
    "parent_url": null,
    "author": null,
    "published": "2025-01-16T10:50:00.000+02:00",
    "title": "Will Gold Surpass $3,000 in 2025? Predictions Vary, But the Reasons Remain the Same.",
    "text": "Gold has traditionally been considered a safe haven during times of uncertainty, and 2025 will be no exception. Following strong growth last year, experts from various institutions agree that gold should continue to rise in the upcoming year, albeit at a slower pace. Geopolitical tensions, global political and economic factors, and demand from central banks are expected to be key drivers. ....",
    "highlightText": "",
    "highlightTitle": "",
    "highlightThreadTitle": "",
    "language": "english",
    "sentiment": null,
    "categories": null,
    "topics": null,
    "ai_allow": true,
    "has_canonical": false,
    "webz_reporter": false,
    "external_links": [
        "https://www.wonderinterest.com/en",
        "https://wonderinterest.com/en"
    ],
    "external_images": [],
    "entities": {
        "persons": [],
        "organizations": [
            {
                "name": "World Gold Council",
                "sentiment": "none"
            },
            {
                "name": "Bank of America",
                "sentiment": "none"
            },
            {
                "name": "Goldman Sachs",
                "sentiment": "none"
            },
            {
                "name": "Commerzbank",
                "sentiment": "none"
            },
            {
                "name": "Reuters",
                "sentiment": "none"
            },
            {
                "name": "Citi",
                "sentiment": "none"
            },
            {
                "name": "ANZ",
                "sentiment": "none"
            }
        ],
        "locations": []
    },
    "syndication": {
        "syndicated": false,
        "syndicate_id": null,
        "first_syndicated": false
    },
    "rating": null,
    "crawled": "2025-01-16T14:22:50.338+02:00",
    "updated": "2025-01-16T14:22:50.338+02:00"
}

```

- **Response**:

```json
{
    "statusCode": 201,
    "data": {
        "id": "cm655e1d40004l16vrja7agkz",
        "uuid": "132a1c972d7a5fd8c361f410e5941293556c2ca6",
        "url": "https://trader-magazine.com/news/will-gold-surpass-3000-in-2025-predictions-vary-but-the-reasons-remain-the-same",
        "ord_in_thread": 0,
        "parent_url": null,
        "author": null,
        "published": "2025-01-16T08:50:00.000Z",
        "title": "Will Gold Surpass $3,000 in 2025? Predictions Vary, But the Reasons Remain the Same.",
        "text": "Gold has traditionally been considered a safe haven during times of uncertainty, and 2025 will be no exception. Following strong growth last year, experts from various institutions agree that gold should continue to rise in the upcoming year, albeit at a slower pace. Geopolitical tensions, global political and economic factors, and demand from central banks are expected to be key drivers. ...." ,
        "language": "english",
        "highlight_text": "",
        "highlight_title": "",
        "highlight_thread_title": "",
        "sentiment": null,
        "categories": [],
        "topics": [],
        "ai_allow": true,
        "has_canonical": false,
        "webz_reporter": false,
        "crawled": "2025-01-16T12:22:50.338Z",
        "updated": "2025-01-16T12:22:50.338Z",
        "rating": null,
        "threadId": "cm655e1cp0000l16vs1t3onmq",
        "thread": {
            "id": "cm655e1cp0000l16vs1t3onmq",
            "uuid": "132a1c972d7a5fd8c361f410e5941293556c2ca6",
            "url": "https://trader-magazine.com/news/will-gold-surpass-3000-in-2025-predictions-vary-but-the-reasons-remain-the-same",
            "site_full": "trader-magazine.com",
            "site": "trader-magazine.com",
            "site_section": "https://www.trader-magazine.com",
            "section_title": "Welcome to Trader-Magazine! Online magazine",
            "title": "Will Gold Surpass $3,000 in 2025? Predictions Vary, But the Reasons Remain the Same.",
            "title_full": "Will Gold Surpass $3,000 in 2025? Predictions Vary, But the Reasons Remain the Same.",
            "published": "2025-01-16T08:50:00.000Z",
            "replies_count": 0,
            "participants_count": 0,
            "site_type": "news",
            "main_image": "",
            "country": "US",
            "site_categories": [],
            "performance_score": 0,
            "domain_rank": null,
            "domain_rank_updated": "1970-01-01T00:00:00.000Z",
            "social": {
                "id": "cm655e1cp0001l16vg4jrjzcg",
                "vk_shares": 0,
                "threadId": "cm655e1cp0000l16vs1t3onmq",
                "facebook": {
                    "id": "cm655e1cp0002l16v8garzzsq",
                    "likes": 0,
                    "comments": 0,
                    "shares": 0,
                    "socialId": "cm655e1cp0001l16vg4jrjzcg"
                }
            }
        },
        "entities": [
            {
                "id": "cm655e1d40005l16vjwlv3txy",
                "name": "World Gold Council",
                "type": "organizations",
                "sentiment": "none",
                "postId": "cm655e1d40004l16vrja7agkz"
            },
            {
                "id": "cm655e1d40006l16vqn05ak1f",
                "name": "Bank of America",
                "type": "organizations",
                "sentiment": "none",
                "postId": "cm655e1d40004l16vrja7agkz"
            },
            {
                "id": "cm655e1d40007l16v9ye9odzd",
                "name": "Goldman Sachs",
                "type": "organizations",
                "sentiment": "none",
                "postId": "cm655e1d40004l16vrja7agkz"
            },
            {
                "id": "cm655e1d40008l16ve20qo55b",
                "name": "Commerzbank",
                "type": "organizations",
                "sentiment": "none",
                "postId": "cm655e1d40004l16vrja7agkz"
            },
            {
                "id": "cm655e1d40009l16vbuuev05f",
                "name": "Reuters",
                "type": "organizations",
                "sentiment": "none",
                "postId": "cm655e1d40004l16vrja7agkz"
            },
            {
                "id": "cm655e1d4000al16vwdsmb0cb",
                "name": "Citi",
                "type": "organizations",
                "sentiment": "none",
                "postId": "cm655e1d40004l16vrja7agkz"
            },
            {
                "id": "cm655e1d4000bl16v20x153rq",
                "name": "ANZ",
                "type": "organizations",
                "sentiment": "none",
                "postId": "cm655e1d40004l16vrja7agkz"
            }
        ],
        "external_links": [
            {
                "id": "cm655e1d4000cl16vabcjarsy",
                "url": "https://www.wonderinterest.com/en",
                "postId": "cm655e1d40004l16vrja7agkz"
            },
            {
                "id": "cm655e1d4000dl16vm40jsyhp",
                "url": "https://wonderinterest.com/en",
                "postId": "cm655e1d40004l16vrja7agkz"
            }
        ],
        "external_images": [],
        "syndication": {
            "id": "cm655e1d4000el16vzd5g4pkb",
            "syndicated": false,
            "syndicate_id": null,
            "first_syndicated": false,
            "postId": "cm655e1d40004l16vrja7agkz"
        }
    }
}
```
