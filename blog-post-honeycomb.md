# Honeycomb - biblioteka komponentow UI dla Hive Blockchain

Budowanie aplikacji na Hive blockchain wymaga za kazdym razem pisania tych samych rzeczy od zera - laczenie z API, wyswietlanie danych uzytkownika, renderowanie postow, obsluga endpointow. Honeycomb to biblioteka komponentow, ktora rozwiazuje ten problem - gotowe klocki do budowania aplikacji Hive, dzialajace z czterema najpopularniejszymi frameworkami frontendowymi.

## Po co to powstalo?

Kazdy kto budowal frontend dla Hive zna ten schemat: laczymy sie z API, piszemy logike fallbacku miedzy endpointami, formatujemy dane konta, renderujemy Markdown z postow, obsugujemy media embedowane w tresci. I za kazdym razem piszemy to od nowa.

Honeycomb zbiera te powtarzalne wzorce w jedno miejsce - jako pakiet npm, ktory instalujesz i uzywasz. Nie musisz kopiowac kodu miedzy projektami ani pisac wlasnych wrapperow na `@hiveio/wax`.

## Co oferuje?

### Cztery frameworki, jedno API

Honeycomb wspiera:

- **React 19** (`@hiveio/honeycomb-react`)
- **Solid.js 1.9** (`@hiveio/honeycomb-solid`)
- **Vue 3** (`@hiveio/honeycomb-vue`)
- **Svelte 5** (`@hiveio/honeycomb-svelte`)

Kazdy pakiet ma identyczne API dostosowane do konwencji danego frameworka - hooki w React, composables w Vue, runes w Svelte. Logika pod spodem jest wspolna (pakiet core), wiec zachowanie jest identyczne niezaleznie od wyboru technologii.

### Komponenty

**Wyswietlanie uzytkownika:**

- `HiveAvatar` - avatar uzytkownika Hive z automatycznym pobieraniem
- `UserCard` - karta profilu z reputacja, data dolaczenia, liczba postow

**Portfel:**

- `BalanceCard` - salda HIVE, HBD, HP w czytelnym formacie
- `HiveManabar` - pasek Resource Credits i Voting Power z wizualizacja procentowa

**Posty:**

- `HivePostCard` - karta pojedynczego posta z miniaturka, autorem, payoutem
- `HivePostList` - lista postow z sortowaniem (trending, hot, created, promoted)
- `HiveContentRenderer` - renderowanie tresci Markdown z obsluga embedow (YouTube, 3Speak, Twitter) i sanityzacja XSS

**Edytor:**

- `MdEditor` - edytor Markdown z podgladem na zywo, paskiem narzedzi i obsluga draftow

**Infrastruktura:**

- `HiveProvider` - wrapper konfiguracyjny dla calej aplikacji
- `ApiTracker` - wizualizacja stanu polaczenia z API
- `HealthChecker` - monitoring i zarzadzanie endpointami API z automatycznym fallbackiem

> ![image.png](https://images.hive.blog/DQmc5DfjhuYFMEpjuRPyUrGL4UinfEiSjGYBsQMB8nmpeUZ/image.png) > ![image.png](https://images.hive.blog/DQmSJn7a8hdRLW1gkZXrje15QgD8LguQKVRc4EeHSGqC6Qd/image.png) > ![image.png](https://images.hive.blog/DQmNQezyMwwpxfsodxHdCL7VfRb8pdLV6wpSsw8eFXbPpPX/image.png)

### Hooki / Composables

```
useHiveAccount("username")   // dane konta
useHivePost("author", "permlink")  // pojedynczy post
useHivePostList("trending")  // lista postow
useHiveStatus()              // status polaczenia
```

Dane sa pobierane bezposrednio z blockchainu przez `@hiveio/wax`. Nie ma posrednikow ani wlasnego backendu.

```
import { useHiveAccount } from "@hiveio/honeycomb-react";

function UserProfile({ username }: { username: string }) {
  const { account, is_loading, error, refetch } = useHiveAccount(username);

  if (is_loading) return <p>Loading account...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!account) return <p>Account not found</p>;

  return (
    <div>
      <h2>{account.name}</h2>
      <p>Balance: {account.balance}</p>
      <p>HBD: {account.hbd_balance}</p>
      <p>Posts: {account.post_count}</p>
      <p>Joined: {account.created}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Zarzadzanie endpointami

Jednym z wiekszych problemow przy pracy z Hive API jest niestabilnosc poszczegolnych nodow. Honeycomb rozwiazuje to wbudowanym mechanizmem:

- automatyczny health check endpointow w tle
- fallback na nastepny endpoint gdy aktualny przestaje odpowiadac
- callbacki na zmiane endpointu, bledy i sytuacje gdy wszystkie nody sa niedostepne
- konfigurowalne interwaly i timeouty

Nie musisz pisac wlasnej logiki retry - biblioteka robi to za Ciebie.

![Screenshot 2026-03-12 at 08.06.44.png](https://images.hive.blog/DQmbLqZGqenAMUaAAFqwtpEgPjHiEcX5m37Gfqks5DCbaQi/Screenshot%202026-03-12%20at%2008.06.44.png)> [SCREENSHOT: Komponent HealthChecker z lista endpointow i ich statusami]

## Jak zaczac?

Instalacja (przyklad dla React):

```bash
npm install @hiveio/honeycomb-react @hiveio/wax
```

Uzycie:

```tsx
import { HiveProvider, UserCard, BalanceCard } from "@hiveio/honeycomb-react";

function App() {
  return (
    <HiveProvider>
      <UserCard username="gtg" />
      <BalanceCard username="gtg" />
    </HiveProvider>
  );
}
```

Dla innych frameworkow zmienia sie tylko import - API pozostaje takie samo.

## Dokumentacja i demo

Dokumentacja jest dostepna pod adresem **honeycomb.bard-dev.com** - zawiera opis kazdego komponentu, przyklady kodu dla wszystkich czterech frameworkow i interaktywne podglady.

Projekt zawiera 13 aplikacji demo pokazujacych integracje z roznymi tech stackami:

| Framework | Integracje                           |
| --------- | ------------------------------------ |
| React     | Next.js, Vite, Astro, React Router 7 |
| Solid.js  | Vite, Astro, SolidStart              |
| Svelte 5  | Vite, SvelteKit, Astro               |
| Vue 3     | Vite, Nuxt, Astro                    |

Niezaleznie od tego jaki stack wybierzesz - jest demo ktore pokazuje jak to podlaczyc.

![image.png](https://images.hive.blog/DQmYAQwS64QjD84fmLXjVspiFUunCgud5YMVWQDEmPNsqLr/image.png)

## Techniczne detale

- **TypeScript** - pelne typowanie, zero `any`
- **SSR compatible** - dziala z Next.js, Nuxt, SvelteKit, SolidStart, Astro
- **Theming** - CSS variables, opcjonalna integracja z Tailwind CSS
- **Tree-shakeable** - importujesz tylko to czego uzywasz
- **Licencja MIT** - open source, bez ograniczen

Kod zrodlowy: **https://github.com/KKocot/honeycomb**

## Co dalej?

Projekt jest aktywnie rozwijany. W planach sa kolejne komponenty i funkcjonalnosci - w tym potencjalnie komponenty aktywne (nie tylko wyswietlajace dane, ale tez pozwalajace na interakcje z blockchainem).

Jesli budujesz cos na Hive i masz pomysly co powinno sie znalezc w bibliotece - daj znac w komentarzach lub otwierz issue na GitHubie.
