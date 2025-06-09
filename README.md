<p align="center">
  <a href="https://github.com/ghoshRitesh12/aniwatch">
    <img 
      src="https://repository-images.githubusercontent.com/838366965/5c03381b-d162-4e71-8eef-0ac44c284411" 
      alt="Logo" 
      width="300"
      decoding="async"
      fetchpriority="high"
    />
  </a>
</p>

# <p align="center">Aniwatch</p>

<div align="center">
  📦 A scraper package serving anime information from <a href="https://hianimez.to/home" target="_blank">hianimez.to</a>
  <br/>
  <strong>
    <a 
      href="https://github.com/ghoshRitesh12/aniwatch/issues/new?assignees=ghoshRitesh12&labels=bug&template=bug-report.yml"
    > 
      Bug report
    </a>
    ·
    <a 
      href="https://github.com/ghoshRitesh12/aniwatch/issues/new?assignees=ghoshRitesh12&labels=enhancement&template=feature-request.md"
    >
      Feature request
    </a>
  </strong>
</div>

<br/>

<div align="center">

[![Publish Package](https://github.com/ghoshRitesh12/aniwatch/actions/workflows/publish.yml/badge.svg)](https://github.com/ghoshRitesh12/aniwatch/actions/workflows/publish.yml)
![NPM Downloads](https://img.shields.io/npm/dw/aniwatch?logo=npm&logoColor=e78284&label=Downloads&labelColor=292e34&color=31c754)
[![GitHub License](https://img.shields.io/github/license/ghoshRitesh12/aniwatch?logo=github&logoColor=%23959da5&labelColor=%23292e34&color=%2331c754)](https://github.com/ghoshRitesh12/aniwatch/blob/main/LICENSE)

<!-- ![npm bundle size](https://img.shields.io/bundlephobia/minzip/aniwatch?logo=npm&logoColor=e78284&label=MinZipped%20Size&labelColor=292e34&color=31c754) -->

</div>

<div align="center">

[![stars](https://img.shields.io/github/stars/ghoshRitesh12/aniwatch?style=social)](https://github.com/ghoshRitesh12/aniwatch/stargazers)
[![forks](https://img.shields.io/github/forks/ghoshRitesh12/aniwatch?style=social)](https://github.com/ghoshRitesh12/aniwatch/network/members)
[![issues](https://img.shields.io/github/issues/ghoshRitesh12/aniwatch?style=social&logo=github)](https://github.com/ghoshRitesh12/aniwatch/issues?q=is%3Aissue+is%3Aopen+)
[![version](https://img.shields.io/github/v/release/ghoshRitesh12/aniwatch?display_name=release&style=social&logo=github)](https://github.com/ghoshRitesh12/aniwatch/releases/latest)

</div>

> [!IMPORTANT]
>
> 1. This package is just an unofficial package for [hianimez.to](https://hianimez.to) and is in no other way officially related to the same.
> 2. The content that this package provides is not mine, nor is it hosted by me. These belong to their respective owners. This package just demonstrates how to build a package that scrapes websites and uses their content.

## Table of Contents

- [Quick Start](#quick-start)
    - [Installation](#installation)
    - [Example Usage](#example-usage)
- [Documentation](#documentation)
-   - [getHomePage](#gethomepage)
    - [getAZList](#getazlist)
    - [getQtipInfo](#getqtipinfo)
    - [getAnimeAboutInfo](#getanimeaboutinfo)
    - [getAnimeSearchResults](#getanimesearchresults)
    - [getAnimeSearchSuggestion](#getanimesearchsuggestion)
    - [getProducerAnimes](#getproduceranimes)
    - [getGenreAnime](#getgenreanime)
    - [getAnimeCategory](#getanimecategory)
    - [getEstimatedSchedule](#getestimatedschedule)
    - [getNextEpisodeSchedule](#getnextepisodeschedule)
    - [getAnimeEpisodes](#getanimeepisodes)
    - [getEpisodeServers](#getepisodeservers)
    - [getAnimeEpisodeSources](#getanimeepisodesources)
- [Development](#development)
- [Thanks](#thanks)
- [Support](#support)
- [License](#license)
- [Contributors](#contributors)
- [Star History](#star-history)

## Quick start

### Installation

To use `aniwatch` package in your project, run:

```bash
pnpm add aniwatch
# or "yarn add aniwatch"
# or "npm install aniwatch"
```

### Example usage

Example - getting information about an anime by providing it's unique anime id, using anime [Steins;Gate](https://www.imdb.com/title/tt1910272/) with `steinsgate-3` unique anime id as an example.

```javascript
import { HiAnime, HiAnimeError } from "aniwatch";

const hianime = new HiAnime.Scraper();

try {
    const data: HiAnime.ScrapedAnimeAboutInfo = await hianime.getInfo(
        "steinsgate-3"
    );
    console.log(data);
} catch (err) {
    console.error(err instanceof HiAnimeError, err);
}
```

<details>

<summary>

### `getHomePage`

</summary>

#### Sample Usage

```typescript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getHomePage()
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  genres: ["Action", "Cars", "Adventure", ...],
  latestEpisodeAnimes: [
    {
      id: string,
      name: string,
      poster: string,
      type: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  spotlightAnimes: [
    {
      id: string,
      name: string,
      jname: string,
      poster: string,
      description: string,
      rank: number,
      otherInfo: string[],
      episodes: {
        sub: number,
        dub: number,
      },
    },
    {...},
  ],
  top10Animes: {
    today: [
      {
        episodes: {
          sub: number,
          dub: number,
        },
        id: string,
        name: string,
        poster: string,
        rank: number
      },
      {...},
    ],
    month: [...],
    week: [...]
  },
  topAiringAnimes: [
    {
      id: string,
      name: string,
      jname: string,
      poster: string,
    },
    {...},
  ],
  topUpcomingAnimes: [
    {
      id: string,
      name: string,
      poster: string,
      duration: string,
      type: string,
      rating: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  trendingAnimes: [
    {
      id: string,
      name: string,
      poster: string,
      rank: number,
    },
    {...},
  ],
  mostPopularAnimes: [
    {
      id: string,
      name: string,
      poster: string,
      type: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  mostFavoriteAnimes: [
    {
      id: string,
      name: string,
      poster: string,
      type: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  latestCompletedAnimes: [
    {
      id: string,
      name: string,
      poster: string,
      type: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
}

```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getAZList`

</summary>

#### Parameters

|  Parameter   |  Type  |                                             Description                                             | Required? | Default |
| :----------: | :----: | :-------------------------------------------------------------------------------------------------: | :-------: | :-----: |
| `sortOption` | string | The az-list sort option. Possible values include: "all", "other", "0-9" and all english alphabets . |    Yes    |   --    |
|    `page`    | number |                                   The page number of the result.                                    |    No     |   `1`   |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getAZList("0-9", 1)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  sortOption: "0-9",
  animes: [
    {
      id: string,
      name: string,
      jname: string,
      poster: string,
      duration: string,
      type: string,
      rating: string,
      episodes: {
        sub: number ,
        dub: number
      }
    },
    {...}
  ],
  totalPages: 1,
  currentPage: 1,
  hasNextPage: false
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getQtipInfo`

</summary>

#### Parameters

| Parameter |  Type  |             Description              | Required? | Default |
| :-------: | :----: | :----------------------------------: | :-------: | :-----: |
| `animeId` | string | The unique anime id (in kebab case). |    Yes    |   --    |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getQtipInfo("one-piece-100")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  anime: {
    id: "one-piece-100",
    name: "One Piece",
    malscore: string,
    quality: string,
    episodes: {
      sub: number,
      dub: number
    },
    type: string,
    description: string,
    jname: string,
    synonyms: string,
    aired: string,
    status: string,
    genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Shounen", "Drama", "Fantasy", "Shounen", "Fantasy", "Shounen", "Shounen", "Super Power"]
  }
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getAnimeAboutInfo`

</summary>

#### Parameters

| Parameter |  Type  |             Description              | Required? | Default |
| :-------: | :----: | :----------------------------------: | :-------: | :-----: |
| `animeId` | string | The unique anime id (in kebab case). |    Yes    |   --    |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getInfo("steinsgate-3")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  anime: [
    info: {
      id: string,
      name: string,
      poster: string,
      description: string,
      stats: {
        rating: string,
        quality: string,
        episodes: {
          sub: number,
          dub: number
        },
        type: string,
        duration: string
      },
      promotionalVideos: [
        {
          title: string | undefined,
          source: string | undefined,
          thumbnail: string | undefined
        },
        {...},
      ],
      characterVoiceActor: [
        {
          character: {
            id: string,
            poster: string,
            name: string,
            cast: string
          },
          voiceActor: {
            id: string,
            poster: string,
            name: string,
            cast: string
          }
        },
        {...},
      ]
    }
    moreInfo: {
      aired: string,
      genres: ["Action", "Mystery", ...],
      status: string,
      studios: string,
      duration: string
      ...
    }
  ],
  mostPopularAnimes: [
    {
      episodes: {
        sub: number,
        dub: number,
      },
      id: string,
      jname: string,
      name: string,
      poster: string,
      type: string
    },
    {...},
  ],
  recommendedAnimes: [
    {
      id: string,
      name: string,
      poster: string,
      duration: string,
      type: string,
      rating: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  relatedAnimes: [
    {
      id: string,
      name: string,
      poster: string,
      duration: string,
      type: string,
      rating: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  seasons: [
    {
      id: string,
      name: string,
      title: string,
      poster: string,
      isCurrent: boolean
    },
    {...}
  ]
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getAnimeSearchResults`

</summary>

#### Parameters

|  Parameter   |  Type  |                            Description                            | Required? | Default |
| :----------: | :----: | :---------------------------------------------------------------: | :-------: | :-----: |
|     `q`      | string | The search query, i.e. the title of the item you are looking for. |    Yes    |   --    |
|    `page`    | number |                  The page number of the result.                   |    No     |   `1`   |
|    `type`    | string |                  Type of the anime. eg: `movie`                   |    No     |   --    |
|   `status`   | string |            Status of the anime. eg: `finished-airing`             |    No     |   --    |
|   `rated`    | string |             Rating of the anime. eg: `r+` or `pg-13`              |    No     |   --    |
|   `score`    | string |           Score of the anime. eg: `good` or `very-good`           |    No     |   --    |
|   `season`   | string |              Season of the aired anime. eg: `spring`              |    No     |   --    |
|  `language`  | string |     Language category of the anime. eg: `sub` or `sub-&-dub`      |    No     |   --    |
| `start_date` | string |       Start date of the anime(yyyy-mm-dd). eg: `2014-10-2`        |    No     |   --    |
|  `end_date`  | string |        End date of the anime(yyyy-mm-dd). eg: `2010-12-4`         |    No     |   --    |
|    `sort`    | string |      Order of sorting the anime result. eg: `recently-added`      |    No     |   --    |
|   `genres`   | string |   Genre of the anime, separated by commas. eg: `isekai,shounen`   |    No     |   --    |

> [!TIP]
>
> For both `start_date` and `end_date`, year must be mentioned. If you wanna omit date or month specify `0` instead. Eg: omitting date -> 2014-10-0, omitting month -> 2014-0-12, omitting both -> 2014-0-0

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .search("monster", 1, {
        genres: "seinen,psychological",
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });
```

#### Response Schema

```javascript
{
  animes: [
    {
      id: string,
      name: string,
      poster: string,
      duration: string,
      type: string,
      rating: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  mostPopularAnimes: [
    {
      episodes: {
        sub: number,
        dub: number,
      },
      id: string,
      jname: string,
      name: string,
      poster: string,
      type: string
    },
    {...},
  ],
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  searchQuery: string,
  searchFilters: {
    [filter_name]: [filter_value]
    ...
  }
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getAnimeSearchSuggestion`

</summary>

#### Parameters

| Parameter |  Type  |         Description          | Required? | Default |
| :-------: | :----: | :--------------------------: | :-------: | :-----: |
|    `q`    | string | The search suggestion query. |    Yes    |   --    |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .searchSuggestions("one piece")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  suggestions: [
    {
      id: string,
      name: string,
      poster: string,
      jname: string,
      moreInfo: ["Mar 4, 2000", "Movie", "50m"]
    },
    {...},
  ],
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getProducerAnimes`

</summary>

#### Parameters

| Parameter |  Type  |                 Description                 | Required? | Default |
| :-------: | :----: | :-----------------------------------------: | :-------: | :-----: |
|  `name`   | string | The name of anime producer (in kebab case). |    Yes    |
|  `page`   | number |       The page number of the result.        |    No     |   `1`   |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getProducerAnimes("toei-animation", 2)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  producerName: "Toei Animation Anime",
  animes: [
    {
      id: string,
      name: string,
      poster: string,
      duration: string,
      type: string,
      rating: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  top10Animes: {
    today: [
      {
        episodes: {
          sub: number,
          dub: number,
        },
        id: string,
        name: string,
        poster: string,
        rank: number
      },
      {...},
    ],
    month: [...],
    week: [...]
  },
  topAiringAnimes: [
    {
      episodes: {
        sub: number,
        dub: number,
      },
      id: string,
      jname: string,
      name: string,
      poster: string,
      type: string
    },
    {...},
  ],
  currentPage: 2,
  totalPages: 11,
  hasNextPage: true,
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getGenreAnime`

</summary>

#### Parameters

| Parameter |  Type  |               Description                | Required? | Default |
| :-------: | :----: | :--------------------------------------: | :-------: | :-----: |
|  `name`   | string | The name of anime genre (in kebab case). |    Yes    |   --    |
|  `page`   | number |      The page number of the result.      |    No     |   `1`   |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getGenreAnime("shounen", 2)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  genreName: "Shounen Anime",
  animes: [
    {
      id: string,
      name: string,
      poster: string,
      duration: string,
      type: string,
      rating: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  genres: ["Action", "Cars", "Adventure", ...],
  topAiringAnimes: [
    {
      episodes: {
        sub: number,
        dub: number,
      },
      id: string,
      jname: string,
      name: string,
      poster: string,
      type: string
    },
    {...},
  ],
  currentPage: 2,
  totalPages: 38,
  hasNextPage: true
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getAnimeCategory`

</summary>

#### Parameters

| Parameter  |  Type  |          Description           | Required? | Default |
| :--------: | :----: | :----------------------------: | :-------: | :-----: |
| `category` | string |     The category of anime.     |    Yes    |   --    |
|   `page`   | number | The page number of the result. |    No     |   `1`   |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getCategoryAnime("subbed-anime")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));

// categories ->
// "most-favorite", "most-popular", "subbed-anime", "dubbed-anime",
// "recently-updated", "recently-added", "top-upcoming", "top-airing",
// "movie", "special", "ova", "ona", "tv", "completed"
```

#### Response Schema

```javascript
{
  category: "TV Series Anime",
  animes: [
    {
      id: string,
      name: string,
      poster: string,
      duration: string,
      type: string,
      rating: string,
      episodes: {
        sub: number,
        dub: number,
      }
    },
    {...},
  ],
  genres: ["Action", "Cars", "Adventure", ...],
  top10Animes: {
    today: [
      {
        episodes: {
          sub: number,
          dub: number,
        },
        id: string,
        name: string,
        poster: string,
        rank: number
      },
      {...},
    ],
    month: [...],
    week: [...]
  },
  currentPage: 2,
  totalPages: 100,
  hasNextPage: true
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getEstimatedSchedule`

</summary>

#### Parameters

|      Parameter      |  Type  |                             Description                              | Required? | Default |
| :-----------------: | :----: | :------------------------------------------------------------------: | :-------: | :-----: |
| `date (yyyy-mm-dd)` | string | The date of the desired schedule. (months & days must have 2 digits) |    Yes    |   --    |
|     `tzOffset`      | number |      The timezone offset in minutes (defaults to -330 i.e. IST)      |    No     | `-330`  |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();
const timezoneOffset = -330; // IST offset in minutes

hianime
    .getEstimatedSchedule("2025-06-09", timezoneOffset)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  scheduledAnimes: [
    {
      id: string,
      time: string, // 24 hours format
      name: string,
      jname: string,
      airingTimestamp: number,
      secondsUntilAiring: number
    },
    {...}
  ]
}
```

[🔼 Back to Top](#table-of-contents)

</details>

##

<details>

<summary>

### `getNextEpisodeSchedule`

</summary>

#### Parameters

| Parameter |  Type  |             Description              | Required? | Default |
| :-------: | :----: | :----------------------------------: | :-------: | :-----: |
| `animeId` | string | The unique anime id (in kebab case). |    Yes    |   --    |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getNextEpisodeSchedule("one-piece-100")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  airingISOTimestamp: string | null,
  airingTimestamp: number | null,
  secondsUntilAiring: number | null
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getAnimeEpisodes`

</summary>

#### Parameters

| Parameter |  Type  |     Description      | Required? | Default |
| :-------: | :----: | :------------------: | :-------: | :-----: |
| `animeId` | string | The unique anime id. |    Yes    |   --    |

#### Sample Usage

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getEpisodes("steinsgate-3")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  totalEpisodes: 24,
  episodes: [
    {
      number: 1,
      isFiller: false,
      title: "Turning Point",
      episodeId: "steinsgate-3?ep=213"
    },
    {...}
  ]
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getEpisodeServers`

</summary>

#### Parameters

|  Parameter  |  Type  |      Description       | Required? | Default |
| :---------: | :----: | :--------------------: | :-------: | :-----: |
| `episodeId` | string | The unique episode id. |    Yes    |   --    |

#### Request sample

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getEpisodeServers("steinsgate-0-92?ep=2055")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  episodeId: "steinsgate-0-92?ep=2055",
  episodeNo: 5,
  sub: [
    {
      serverId: 4,
      serverName: "vidstreaming",
    },
    {...}
  ],
  dub: [
    {
      serverId: 1,
      serverName: "megacloud",
    },
    {...}
  ],
  raw: [
    {
      serverId: 1,
      serverName: "megacloud",
    },
    {...}
  ],
}
```

[🔼 Back to Top](#table-of-contents)

</details>

<details>

<summary>

### `getAnimeEpisodeSources`

</summary>

#### Parameters

| Parameter  |  Type  |                     Description                      | Required? |     Default      |
| :--------: | :----: | :--------------------------------------------------: | :-------: | :--------------: |
|    `id`    | string |                The id of the episode.                |    Yes    |        --        |
|  `server`  | string |               The name of the server.                |    No     | `"vidstreaming"` |
| `category` | string | The category of the episode ('sub', 'dub' or 'raw'). |    No     |     `"sub"`      |

#### Request sample

```javascript
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

hianime
    .getEpisodeSources("steinsgate-3?ep=230", "hd-1", "sub")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

#### Response Schema

```javascript
{
  headers: {
    Referer: string,
    "User-Agent": string,
    ...
  },
  sources: [
    {
      url: string, // .m3u8 hls streaming file
      isM3U8: boolean,
      quality?: string,
    },
    {...}
  ],
  subtitles: [
    {
      lang: "English",
      url: string, // .vtt subtitle file
    },
    {...}
  ],
  anilistID: number | null,
  malID: number | null,
}
```

[🔼 Back to Top](#table-of-contents)

</details>

## Development

Pull requests are always welcome. If you encounter any bug or want to add a new feature to this package, consider creating a new [issue](https://github.com/ghoshRitesh12/aniwatch/issues). If you wish to contribute to this project, read the [CONTRIBUTING.md](https://github.com/ghoshRitesh12/aniwatch/blob/main/CONTRIBUTING.md) file.

## Contributors

Thanks to the following people for keeping this project alive and relevant.

[![](https://contrib.rocks/image?repo=ghoshRitesh12/aniwatch)](https://github.com/ghoshRitesh12/aniwatch/graphs/contributors)

## Thanks

- [consumet.ts](https://github.com/consumet/consumet.ts)
- [api.consumet.org](https://github.com/consumet/api.consumet.org)

## Support

Don't forget to leave a star 🌟. You can also follow me on X (Twitter) [@riteshgsh](https://x.com/riteshgsh).

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/) - see the [LICENSE](https://github.com/ghoshRitesh12/aniwatch/blob/main/LICENSE) file for more details.

<!-- <br/>
-->

## Star History

<img
  src="https://starchart.cc/ghoshRitesh12/aniwatch.svg?variant=adaptive"
  alt=""
/>
