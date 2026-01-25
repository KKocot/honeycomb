## 😲 md-editor-rt

Markdown Editor for React, developed in jsx and typescript, support different themes、beautify content by prettier.

### 🤖 Base

**bold**, <u>underline</u>, _italic_, ~~line-through~~, superscript^26^, subscript~1~, `inline code`, [link](https://github.com/imzbf)

> quote: I Have a Dream

1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.

- [ ] Friday
- [ ] Saturday
- [x] Sunday

## Marks

==Color== =q=Color== =e=Color== =r=Color== =t=Color== =u=Color== =i=Color== =o=Color== =p=Color== =a=Color== =s=Color== =d=Color== =f=Color== =g=Color== =h=Color== =j=Color== =k=Color== =l=Color== =z=Color== =x=Color== =c=Color== =v=Color== =b=Color== =n=Color== =m=Color==

## 🤗 Demo

```js
import { defineComponent, ref } from "vue";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

export default defineComponent({
  name: "MdEditor",
  setup() {
    const text = ref("");
    return () => (
      <MdEditor
        modelValue={text.value}
        onChange={(v: string) => (text.value = v)}
      />
    );
  },
});
```

## 🖨 Text

The Old Man and the Sea served to reinvigorate Hemingway's literary reputation and prompted a reexamination of his entire body of work.

## 📈 Table

| THead1          |      THead2       |           THead3 |
| :-------------- | :---------------: | ---------------: |
| text-align:left | text-align:center | text-align:right |

## 📏 Formula

Inline: $x+y^{2x}$

$$
\sqrt[3]{x}
$$

## 🪄 Alert

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## Embeds

##### Youtube

- Video
  https://www.youtube.com/watch?v=Kk1vR7BdTno
- Short
  https://www.youtube.com/shorts/_hFKxXG_SrY

##### Twitter/X

- Post
  https://x.com/NASA/status/1935033453424132117

##### Instagram

- Account
  https://www.instagram.com/nasa/
- Post
  https://www.instagram.com/p/DJuVfuGz_TV/
- Reel
  https://www.instagram.com/reel/DKznjJktlFG/

##### 3Speak

- Video
  https://3speak.tv/watch?v=mipiano/zylokfgv

## Links

- Internal
  @guest4test1 @barddev
  #hive #dev

- Good domain
  https://ecency.com
  https://peakd.com

- Unknow domain
  https://www.nasa.gov

- Bad domain

## Images

![image](https://images.hive.blog/DQmfYWmNCseteSrWRAY4Wo35bCEivQZgrPqG16HwjeVSCP3/81b2d8c807e643b5a1766c6f8d5c0f68.webp)
![image](https://images.hive.blog/DQma3iMm2eqK83hiiY9PRrG3dvtXgrANSgEuUbeXLXb4biu/image.png)

# Couple Relationship Graphs – Mermaid Examples

## Simple Relationship Flow (Basic Flowchart)

```mermaid
graph TD
    A(Boy meets Girl) --> B(They start dating)
    B --> C(Fall in love)
    C --> D(Engagement)
    D --> E(Marriage)
```

---

## Compatibility Comparison (Decision Tree)

```mermaid
graph TD
    A[Do they like the same hobbies?] -->|Yes| B[Good Compatibility]
    A -->|No| C[Can they respect differences?]
    C -->|Yes| B
    C -->|No| D[Potential Issues]
```

---

## Timeline of Relationship (Gantt Style)

```mermaid
gantt
    title Relationship Timeline
    dateFormat  YYYY-MM-DD
    section Milestones
    First Date      :a1, 2022-05-01, 1d
    Started Dating  :a2, 2022-05-15, 1d
    First Trip      :a3, 2022-08-10, 3d
    Moved In        :a4, 2023-01-01, 1d
    Engagement      :a5, 2024-02-14, 1d
```

---

## Love Story Network (Complex Graph)

```mermaid
graph LR
    Alice((Alice)) -->|Meets| Bob((Bob))
    Bob -->|Falls for| Alice
    Alice -->|Introduces| Carla((Carla))
    Bob --> Carla
    Carla -->|Gives advice| Alice
    Bob -->|Buys gift for| Alice
    Alice -->|Plans surprise for| Bob
    Carla -->|Also likes| Bob
    subgraph Complications
        Carla -->|Secret feelings| Bob
    end
```

---

## Life Decisions as a Couple (Large Flow)

```mermaid
graph TD
    Start((Start Relationship))
    Start --> Love(Fall in Love)
    Love --> MoveIn(Move in Together)
    MoveIn -->|Happy| Travel(Travel Together)
    MoveIn -->|Arguments| Communicate(Communication)
    Communicate -->|Successful| Travel
    Communicate -->|Unresolved| Breakup1(Breakup?)

    Travel --> Goals(Discuss Future Goals)
    Goals -->|Same Goals| Engage(Engagement)
    Goals -->|Different Goals| Conflict(Major Conflict)

    Engage --> Wedding(Plan Wedding)
    Wedding --> Married(Married Life)
    Married --> Kids(Talk About Kids)
    Kids -->|Yes| Baby1(Baby Born)
    Kids -->|No| Freedom(Enjoy Freedom)

    Conflict --> Breakup2(Breakup)
    Breakup1 --> Start
    Breakup2 --> Start
```
