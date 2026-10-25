export type Scene = { title: string; paragraphs: string[]; talk: string; kind: 'choice' | 'select' | 'match' | 'sequence'; task: string; options: string[]; answer: number[]; hint: string; truth: string }
export type Copy = { title: string; intro: string; names: string[]; labels: string[]; scenes: Scene[]; end: string[]; adult: string[] }
export const copy: Record<'en' | 'ru', Copy> = {
  "en": {
    "title": "Who am I?",
    "intro": "Have you ever waited for someone to choose you? Michael has, and being picked last hurt more than he expected. Follow him and Rosie from the edge of the soccer field to an open Bible—and back to a difficult moment in the game. Read, talk, and try eight challenges as you discover what Peter says about belonging to Jesus.",
    "names": [
      "Chosen",
      "Royal priesthood",
      "Holy",
      "God’s people",
      "Witnesses"
    ],
    "labels": [
      "Pretty",
      "Smart",
      "Popular",
      "Strong",
      "Rich"
    ],
    "scenes": [
      {
        "title": "Picked last",
        "paragraphs": [
          "“They picked me last,” Michael told Rosie while the teams waited for the game to begin. He looked down at his shoes. “Nobody wants me.”",
          "Rosie sat beside him instead of hurrying him back to the field. “That really hurt, didn’t it?” Michael nodded. He had heard everyone else’s name before his own, and now it felt as though that one moment said everything about him.",
          "“Let’s talk to Anna,” Rosie said. Together they went to the table near the field, where Anna was ready to read the Bible with them. She listened before opening to Peter’s letter.",
          "“Being picked last doesn’t mean nobody wants you,” Anna said. “But I understand why you’re sad. Let’s see what God says about His people.” Michael leaned closer to the page. Could the captains’ choice really tell him who he was?"
        ],
        "talk": "Pause together: What might you say to Michael before offering advice? You can also think quietly; you do not have to share a hurtful experience.",
        "kind": "select",
        "task": "Which TWO thoughts make Michael feel he must impress others to be wanted?",
        "options": [
          "I only matter if everyone likes me.",
          "My skills can help someone.",
          "God will want me only if I get the best grades.",
          "I can listen when a friend is sad."
        ],
        "answer": [
          0,
          2
        ],
        "hint": "Look for thoughts that make popularity or grades the price of being wanted.",
        "truth": "Being picked last hurt Michael, but the team captains could not decide whether he could come to Jesus. God’s Word tells us what it means to belong to Him."
      },
      {
        "title": "Chosen—not a popularity contest",
        "paragraphs": [
          "Anna read the passage aloud. Michael noticed that Peter was speaking to a whole group of people, not awarding a prize to one star player. “Who is he writing to?” he asked.",
          "“People who trust Jesus,” Anna answered. “Some of them knew what it was like to be rejected. Peter reminded them that they were chosen by God to belong to Him. They hadn’t earned that place by being the strongest or the most popular.”",
          "“So I don’t have to get picked first?” Michael asked. “No,” said Anna. “You come to God through Jesus, trusting His mercy. You don’t have to impress Him into loving you.”",
          "Rosie was still sitting beside him. “You trust Jesus, Michael. Being picked last cannot take you away from Him.” The captains’ choice still stung, but it was not the whole truth about him. “Can I tell God how I feel?” he asked."
        ],
        "talk": "Take a minute: How is God’s call different from the captains choosing teams?",
        "kind": "choice",
        "task": "Michael asks, “How do I earn a place among God’s people?” What helps him understand?",
        "options": [
          "Be more popular before coming to Jesus.",
          "Come to Jesus trusting His mercy, not your achievements.",
          "Make sure you are never picked last again."
        ],
        "answer": [
          1
        ],
        "hint": "God’s call is grace through Jesus, not a prize for the best performer.",
        "truth": "God calls us to come to Him through Jesus. Michael does not have to become the best player before he can trust Him."
      },
      {
        "title": "Royal priesthood—welcome to draw near",
        "paragraphs": [
          "“Yes,” Anna said. “You can tell Him the truth, even when you’re upset.” Michael pointed to two words in the passage. “But what does royal priesthood mean? I’m not a king—or a pastor.”",
          "“Royal reminds us that we belong to King Jesus,” Anna explained. “And because of Jesus, His people can come near to God. You don’t have to wait for a pastor to pray for you. You can pray directly to God through Jesus yourself.”",
          "“Even right here?” Michael asked. Anna nodded. “Right here. And His people don’t only pray. We worship Him with thanks and serve Him by caring for others.”",
          "Michael looked at the next description: holy. “Do I have to stop feeling hurt first?”",
          "“Holy means we belong to God and learn His ways,” Anna said. “It doesn’t mean we’re already perfect. You can ask Him for help with the hurt instead of pretending it isn’t there.”",
          "Michael bowed his head. “God, I’m still hurt. Help me not hold on to anger. Help me be kind.” He did not need fancy words. He was speaking to God through Jesus."
        ],
        "talk": "If you would like, put one honest request into your own words. You may pray quietly or simply listen.",
        "kind": "select",
        "task": "Choose THREE ways God’s people live as a royal priesthood.",
        "options": [
          "Pray to God through Jesus.",
          "Wait for a pastor because God cannot hear children.",
          "Worship God with thanks.",
          "Serve someone as an offering of love to God."
        ],
        "answer": [
          0,
          2,
          3
        ],
        "hint": "Ask which actions draw us near to God through Jesus and express love for Him. Does a child have to wait for someone else to pray?",
        "truth": "Jesus is the way to the Father. Children who trust Him can pray, worship, and serve too."
      },
      {
        "title": "Holy—belonging changes our choices",
        "paragraphs": [
          "When the game began, Michael ran onto the field with the others. He wanted to play well, and he wanted his team to win. His prayer had not made him forget being picked last. But he did not have to let that hurt decide how he treated someone else.",
          "Later, with his team one goal behind, Ben had one last chance to tie the game. He swung his foot, missed the ball, and fell. The chance was gone. The game ended, and their team had lost.",
          "“We lost because of you!” someone shouted. Ben was still on the ground. Michael felt disappointed too. For a moment he looked toward the goal; then he looked back at Ben and reached down to help him up.",
          "“It’s okay. I’ve missed before,” Michael said. Rosie came over. “Come sit with us.” There would be no more kicks in this game, but Ben did not have to sit alone.",
          "“Aren’t you mad at me?” Ben asked.",
          "“I wanted to win, but I’m not going to be mean to you,” Michael said.",
          "Rosie added, “Jesus has been so kind to us. We want to treat you that way too.”",
          "Michael was learning what Anna meant by holy: belonging to God was shaping an ordinary choice, right there on the field. He could be disappointed without joining in the blame. Helping Ben did not earn God’s love; it was a way to respond to the love he had received."
        ],
        "talk": "Practice with a friend: say one calm sentence that stands up for a child being mocked. How could a trusted adult help?",
        "kind": "choice",
        "task": "Which choice fits belonging to a holy God?",
        "options": [
          "Laugh so the group accepts you.",
          "Hurt the children who were teasing.",
          "Help Ben up and speak kindly, even though you wanted to win."
        ],
        "answer": [
          2
        ],
        "hint": "Holy living reflects God’s goodness. Protect the child without joining the cruelty.",
        "truth": "We do good because we belong to God, not to purchase a place with Him. When we fail, we can confess our sin and seek His help to change."
      },
      {
        "title": "God’s people—not just a building",
        "paragraphs": [
          "The three friends walked back to Anna’s table. Michael made room for Ben beside the open Bible. Earlier, Rosie had listened when Michael felt unwanted. Now Michael could listen to Ben without making him explain the missed kick all over again.",
          "Anna welcomed them. As they settled down, Michael looked again at Peter’s words about God’s people. “Does that mean the people in a church building?” he asked.",
          "“The Church is Christ’s family,” Anna said. “A building gives us somewhere to meet, but walls can’t pray or love anyone. God’s people are the people who belong to Him through trusting Jesus. They can meet in different places and still belong to the same Lord.”",
          "A team brings people together to play a game. God brings His people together to share life with Him and care for one another. Welcoming Ben did not make him a Christian, but it gave the friends a real way to show care and invite him to learn about Jesus with them."
        ],
        "talk": "Think of someone who might feel forgotten. What small, realistic kindness could you offer with a trusted adult’s help?",
        "kind": "choice",
        "task": "The church building is closed for repairs. Has the church disappeared?",
        "options": [
          "No. The people who belong to Jesus can still pray, meet, and care for each other.",
          "Yes. A church is only its walls and roof.",
          "No, because whoever has the nicest building is God’s favourite."
        ],
        "answer": [
          0
        ],
        "hint": "The building is a meeting place. God’s people are people joined to Jesus.",
        "truth": "God makes a people for His own possession. Caring for one another helps us live as the family we have been given."
      },
      {
        "title": "Witnesses—tell and show His goodness",
        "paragraphs": [
          "“Rosie told me you’re being kind because of Jesus,” Ben said as they sat at the table. Anna smiled. “That connects with something else in this passage. Peter says God’s people are to tell how wonderful He is.”",
          "Michael glanced at Rosie. She had already done that on the field. She had not given a long speech or tried to impress Ben. She had simply explained why Jesus’ kindness mattered to them.",
          "That is what this lesson means by witnesses: people who tell the truth about God’s goodness. Peter describes God calling His people out of darkness into His marvelous light—out of life away from Him and into knowing and following Him.",
          "Helping Ben showed care, but the kind act alone could not explain who Jesus is. Rosie’s words pointed to Him. Words and actions belong together: we tell others about His goodness and learn to treat them in ways that fit what we say."
        ],
        "talk": "Practice an honest answer to “Why are you helping?” Mention Jesus’ goodness without boasting or pressuring your friend.",
        "kind": "match",
        "task": "Which description does each sentence explain most directly? Choose one in each row, then check.",
        "options": [
          "Belonging to God and learning to choose His ways",
          "Praying and worshipping through Jesus",
          "Telling a friend about Jesus’ mercy"
        ],
        "answer": [
          2,
          1,
          4
        ],
        "hint": "Think about what each sentence emphasizes: a changed life, drawing near to God, or telling others about Him.",
        "truth": "Michael prayed, helped Ben up, and Rosie told Ben about Jesus’ kindness. Their kindness was a response to God’s mercy."
      },
      {
        "title": "Mercy—not a medal",
        "paragraphs": [
          "Anna returned to the last line of the passage. “Peter says God’s people have received mercy. That’s where our kindness begins—not with how good we are, but with how good God has been to us.”",
          "Missing a kick was not a sin. Ben did not need forgiveness for losing the game. But all of them needed God’s mercy for real sins—for the wrong things they had said, done, and wanted. Mercy means God offers forgiveness instead of the punishment our sin deserves.",
          "Jesus died for our sins and rose again. God offers forgiveness through Him. We turn to Jesus and trust Him; we cannot earn salvation by being kind. Kindness is our response to His mercy, not its price.",
          "Michael looked back over the afternoon. Helping Ben had not bought him a place with God. He had asked God for help because he already trusted Jesus. Then, when someone else was hurting, he had a chance to pass on kindness.",
          "He still wished his team had won. But the score was not the most important thing he would carry home. He belonged to Jesus, and he could keep learning to love others—even on disappointing days."
        ],
        "talk": "Take a quiet minute: Why does mercy come before our good deeds? You may ask a trusted Christian adult any question you have.",
        "kind": "choice",
        "task": "Which sentence puts the gift and the response in the right order?",
        "options": [
          "I am kind, so Jesus owes me a place.",
          "Jesus shows mercy; trusting Him, I learn to live as one of His people.",
          "I attend church, so I never need forgiveness."
        ],
        "answer": [
          1
        ],
        "hint": "A gift is received, not purchased. Mercy comes first; changed choices are our response.",
        "truth": "Jesus welcomes those who turn to Him and trust Him. His mercy is a gift, and He helps His people learn to love others."
      },
      {
        "title": "Carry mercy with you",
        "paragraphs": [
          "Before the friends left the table, Anna invited them to read Peter’s words once more. This time, Michael listened for what God had done, not for a way to earn His approval.",
          "Read the passage below slowly. Find the descriptions of God’s people in verse 9, and notice what He calls them to do. In verse 10, look for the two changes from “once” to “now”. What has God given His people?",
          "When you are ready, open the challenge. The passage will be hidden so you can rebuild verse 10 from memory. Tap the pieces in order. If you need another look, return to the story and study before trying again."
        ],
        "talk": "What has changed for God’s people?",
        "kind": "sequence",
        "task": "Rebuild 1 Peter 2:10 from memory. Tap the pieces in order, then check. Tap a selected piece again to remove it.",
        "options": [
          "once you had not received mercy,",
          "Once you were not a people,",
          "but now you have received mercy.",
          "but now you are God’s people;"
        ],
        "answer": [
          1,
          3,
          0,
          2
        ],
        "hint": "Begin with what was true once. Then what is true now? The second pair is about mercy.",
        "truth": "God has made His people His own and shown them mercy. His gift comes before our response."
      }
    ],
    "end": [
      "At their next Bible gathering, Michael noticed someone new waiting by the table. He remembered Ben, and he remembered being picked last. This time he did not wait for Rosie to notice. “Come and sit with us,” he said, holding out a welcoming hand. Beside the open Bible, there was room for another friend.",
      "Michael began with the question “Who am I?” Now he was learning to ask “Whose am I?” You can think about that question too. If you have questions about belonging to Jesus, you can talk with a trusted Christian adult who will listen and help you.",
      "If you want to turn to Jesus, tell Him honestly about your sin, ask His forgiveness, and trust Him to save you. You can speak in your own words. If you already trust Him, thank Him for His mercy and ask Him to help you care for the people you meet today."
    ],
    "adult": [
      "Allow about 20–30 minutes, or read in two sittings. Read the passage and story aloud with younger children. Pause at the questions; thoughtful conversation matters more than finishing quickly. The eight challenges move from recognizing false measures of worth to applying the passage and recalling verse 10.",
      "1 Peter 2:9–10 addresses the believing community in Christ, not an unqualified self-esteem statement about every viewer. Chosen race, royal priesthood, holy nation, and a people for His possession are corporate descriptions. “Witnesses” is our teaching label for the purpose clause about proclaiming His excellencies, not a fifth noun quoted from the verse.",
      "Access to God is through Jesus, not independent of Him; the priesthood of believers does not abolish pastoral care. Holiness is belonging and a changed life, not sinless perfection. Good works and church attendance do not earn new identity or salvation.",
      "Michael, Rosie, Ben, and Anna form an imagined present-day teaching story, not a Bible event or a promise that kindness always stops bullying. Do not solicit public conversion decisions or disclosures of painful experiences. Help a child seek safe adult support when needed.",
      "English Scripture is ESV; Russian Scripture is the Synodal translation (RST). Both complete passage excerpts remain unchanged from the verified source. The sidebar contrasts people’s judgments with Bible teaching; it is not a second Bible quotation. The website tells the story more fully than the printable booklet; the booklet and its answer key remain a separate, shorter activity."
    ]
  },
  "ru": {
    "title": "Кто я?",
    "intro": "Ты когда-нибудь ждал, когда выберут тебя? Мишу выбрали в команду последним, и ему стало очень обидно. Вместе с Мишей и Розой мы откроем Библию, а потом вернёмся на футбольное поле, где друзьям предстоит непростой выбор. Читай, размышляй и выполняй восемь заданий, чтобы узнать, что Пётр говорит о Божьем народе.",
    "names": [
      "Избранные",
      "Царственное священство",
      "Святые",
      "Божий народ",
      "Свидетели"
    ],
    "labels": [
      "Красивый",
      "Умный",
      "Популярный",
      "Сильный",
      "Богатый"
    ],
    "scenes": [
      {
        "title": "Когда тебя выбрали последним",
        "paragraphs": [
          "«Меня выбрали последним», — сказал Миша Розе, пока команды ждали начала игры. Он смотрел на свои кроссовки. «Я никому не нужен».",
          "Роза села рядом и не стала торопить его на поле. «Тебе очень обидно, да?» Миша кивнул. Сначала назвали всех остальных, а его — в самом конце. Теперь ему казалось, будто этот выбор говорит о нём всё.",
          "«Давай поговорим с Анной», — предложила Роза. Они подошли к столу недалеко от поля, где Анна собиралась почитать с ними Библию. Она сначала выслушала Мишу, а потом открыла послание Петра.",
          "«Если тебя выбрали последним, это ещё не значит, что ты никому не нужен, — сказала Анна. — Но я понимаю, почему тебе грустно. Давай посмотрим, что Бог говорит о Своём народе». Миша придвинулся к книге. Неужели выбор капитанов решает, кто он такой?"
        ],
        "talk": "Обсудите: что можно сказать Мише, прежде чем давать советы? Можно просто подумать. Не обязательно рассказывать о том, что вас обидело.",
        "kind": "select",
        "task": "Выбери ДВЕ мысли, в которых мнение людей решает, нужен ли ты.",
        "options": [
          "Я чего-то стою, только если всем нравлюсь.",
          "Мои умения могут кому-то помочь.",
          "Бог захочет принять меня, только если у меня лучшие оценки.",
          "Я могу выслушать друга, которому грустно."
        ],
        "answer": [
          0,
          2
        ],
        "hint": "Найди мысли, в которых любовь нужно заслужить популярностью или оценками.",
        "truth": "Чужие слова могут ранить, но они не решают, кто принадлежит Иисусу. О том, кто такой Божий народ, мы узнаем из Божьего Слова."
      },
      {
        "title": "Избранные — не самые популярные",
        "paragraphs": [
          "Анна прочитала отрывок вслух. Миша заметил: Пётр обращается ко многим людям, а не награждает одного победителя. «Кому он пишет?» — спросил он.",
          "«Тем, кто доверяет Иисусу, — ответила Анна. — Среди них были люди, которых отвергали другие. Пётр напомнил им: Бог избрал их, чтобы они принадлежали Ему. Они не заслужили это место силой или популярностью».",
          "«Значит, необязательно, чтобы меня выбирали первым?» — спросил Миша. «Необязательно. Мы приходим к Богу через Иисуса и доверяем Его милости, — сказала Анна. — Его любовь не нужно заслуживать успехами».",
          "Роза всё ещё сидела рядом. «Ты доверяешь Иисусу, Миша. То, что тебя выбрали последним, не отнимает тебя у Него». Ему по-прежнему было обидно, но теперь он понимал: выбор капитанов — далеко не всё, что можно о нём сказать. «А можно рассказать Богу, как мне обидно?»"
        ],
        "talk": "Подумайте минутку: чем Божий призыв отличается от выбора игроков в команды?",
        "kind": "choice",
        "task": "Миша спрашивает: «Как заслужить место среди Божьего народа?» Что поможет ему понять?",
        "options": [
          "Сначала стань популярнее, а потом приходи к Иисусу.",
          "Приходи к Иисусу, доверяя Его милости, а не своим успехам.",
          "Постарайся, чтобы тебя больше никогда не выбирали последним."
        ],
        "answer": [
          1
        ],
        "hint": "Бог зовёт по благодати через Иисуса. Это не награда лучшему игроку.",
        "truth": "Бог зовёт нас к Себе через Иисуса. Мише не нужно становиться лучшим игроком, чтобы довериться Ему."
      },
      {
        "title": "Царственное священство — можно прийти к Богу",
        "paragraphs": [
          "«Конечно, — ответила Анна. — Ему можно честно рассказать о том, что чувствуешь». Миша показал на слова в Библии: «А что такое царственное священство? Я ведь не царь и не пастор».",
          "«Царственное — потому что мы принадлежим Царю Иисусу, — объяснила Анна. — А священство напоминает: через Иисуса Божьи люди могут обращаться к Богу. Тебе не нужно ждать, пока пастор помолится за тебя. Ты сам можешь молиться прямо Богу через Иисуса».",
          "«Даже здесь?» Анна кивнула. «Даже здесь. И Божьи люди не только молятся. Мы благодарим Бога, поклоняемся Ему и служим Ему, заботясь о других».",
          "Миша прочитал дальше: народ святой. «А сначала нужно перестать обижаться?»",
          "«Святые принадлежат Богу и учатся жить по Его воле, — сказала Анна. — Это не значит, что они уже безгрешны. Не нужно делать вид, будто тебе не больно. Попроси Бога помочь тебе».",
          "Миша склонил голову. «Боже, мне всё ещё обидно. Помоги мне не держать зла на других и быть добрым». Ему не понадобились особенные слова: он говорил с Богом через Иисуса."
        ],
        "talk": "Если хочешь, скажи своими словами, о чём ты попросил бы Бога. Можно помолиться про себя или просто послушать.",
        "kind": "select",
        "task": "Выбери ТРИ дела царственного священства.",
        "options": [
          "Молиться Богу через Иисуса.",
          "Ждать пастора, потому что Бог не слышит детей.",
          "Поклоняться Богу с благодарностью.",
          "Помогать человеку из любви к Богу."
        ],
        "answer": [
          0,
          2,
          3
        ],
        "hint": "Какие дела помогают обращаться к Богу через Иисуса и выражать любовь к Нему? Обязательно ли ребёнку ждать, чтобы за него помолился кто-то другой?",
        "truth": "Иисус открывает путь к Отцу. Дети, которые доверяют Ему, тоже могут молиться, поклоняться и служить."
      },
      {
        "title": "Святые — принадлежать Богу и жить иначе",
        "paragraphs": [
          "Когда началась игра, Миша побежал на поле вместе с остальными. Ему хотелось хорошо сыграть и победить. После молитвы он не забыл, как его выбрали последним. Но обида не должна была решать, как он поступит с другим человеком.",
          "Позже команда Миши проигрывала один мяч. У Бена оставался последний шанс сравнять счёт. Он замахнулся, промахнулся по мячу и упал. Шанс был упущен. Игра закончилась, и их команда проиграла.",
          "«Мы проиграли из-за тебя!» — крикнул кто-то. Бен всё ещё сидел на земле. Миша тоже расстроился. Он посмотрел на ворота, потом на Бена и протянул ему руку, чтобы помочь встать.",
          "«Ничего, я тоже промахивался», — сказал Миша. Подошла Роза: «Иди, посиди с нами». Игра уже закончилась, но Бену не нужно было оставаться одному.",
          "«Вы на меня не сердитесь?» — спросил Бен.",
          "«Я хотел выиграть, но обижать тебя не буду», — ответил Миша.",
          "Роза добавила: «Иисус так добр к нам. Мы тоже хотим быть добрыми к тебе».",
          "Миша начинал понимать слова Анны о святости. Принадлежность Богу меняла его обычные поступки — даже здесь, на поле. Можно расстроиться из-за проигрыша и всё же не обвинять друга. Помощью Бену Миша не зарабатывал Божью любовь, а отвечал на неё."
        ],
        "talk": "Потренируйтесь вдвоём: скажите одну спокойную фразу в защиту ребёнка, над которым смеются. Как может помочь взрослый?",
        "kind": "choice",
        "task": "Какой поступок соответствует жизни с Богом?",
        "options": [
          "Засмеяться, чтобы тебя приняли в компанию.",
          "Обижать тех, кто дразнился.",
          "Помочь Бену встать и сказать добрые слова, хотя хотелось выиграть."
        ],
        "answer": [
          2
        ],
        "hint": "Святая жизнь отражает Божью доброту. Защити ребёнка, не присоединяясь к жестокости.",
        "truth": "Мы делаем добро, потому что принадлежим Богу, а не чтобы купить себе место у Него. Если согрешили, можно признать грех и попросить помощи измениться."
      },
      {
        "title": "Божий народ — не просто здание",
        "paragraphs": [
          "Друзья вернулись к столу Анны. Миша освободил для Бена место рядом с открытой Библией. Раньше Роза выслушала Мишу, когда ему казалось, что он никому не нужен. Теперь он мог выслушать Бена, не заставляя его снова оправдываться за промах.",
          "Анна приветливо встретила их. Когда все сели, Миша ещё раз посмотрел на слова о Божьем народе. «Это те, кто находится в здании церкви?» — спросил он.",
          "«Церковь — семья Христа, — ответила Анна. — В здании удобно собираться, но стены не умеют молиться и любить. Божий народ — люди, которые принадлежат Ему через веру в Иисуса. Они могут встречаться в разных местах и всё равно принадлежать одному Господу».",
          "В команду собираются, чтобы играть. А Бог собирает Свой народ, чтобы люди жили с Ним и заботились друг о друге. От того, что Бена пригласили за стол, он ещё не стал христианином. Но друзья могли позаботиться о нём и предложить вместе узнать больше об Иисусе."
        ],
        "talk": "Вспомни человека, который может чувствовать себя забытым. Какое небольшое доброе дело ты мог бы сделать с помощью взрослого?",
        "kind": "choice",
        "task": "Здание церкви закрыли на ремонт. Исчезла ли Церковь?",
        "options": [
          "Нет. Люди Иисуса по-прежнему могут молиться, встречаться и заботиться друг о друге.",
          "Да. Церковь — это только стены и крыша.",
          "Нет, потому что Бог больше любит тех, у кого красивое здание."
        ],
        "answer": [
          0
        ],
        "hint": "Здание — место встреч. Божий народ — люди, соединённые с Иисусом.",
        "truth": "Бог собирает Свой народ в одну семью. Мы учимся жить вместе, когда заботимся друг о друге и замечаем тех, кому одиноко."
      },
      {
        "title": "Свидетели — говорить и показывать Его доброту",
        "paragraphs": [
          "«Роза сказала, что вы добры ко мне из-за Иисуса», — вспомнил Бен за столом. Анна улыбнулась: «Это связано ещё с одной мыслью из отрывка. Пётр говорит, что Божьи люди призваны рассказывать, какой Бог чудесный».",
          "Миша посмотрел на Розу. Она уже сделала это на поле. Ей не понадобилась длинная речь, и она не старалась произвести впечатление на Бена. Она просто объяснила, почему доброта Иисуса важна для них.",
          "В этом уроке мы называем таких людей свидетелями: они говорят правду о Божьей доброте. Пётр пишет, что Бог призвал Свой народ из тьмы в Свой чудный свет. Раньше люди жили вдали от Него, а теперь знают Его и следуют за Ним.",
          "Помогая Бену, Миша проявил заботу. Но один добрый поступок ещё не объясняет, Кто такой Иисус. Об этом сказала Роза. Слова и дела нужны вместе: мы рассказываем о Божьей доброте и учимся поступать так, чтобы наши дела не противоречили нашим словам."
        ],
        "talk": "Потренируйся отвечать на вопрос: «Почему ты помогаешь?» Расскажи о доброте Иисуса честно, без хвастовства и давления на друга.",
        "kind": "match",
        "task": "О каком описании Божьего народа говорится в каждой строке? Выбери по одному ответу и проверь.",
        "options": [
          "Принадлежать Богу и учиться поступать по Его воле",
          "Молиться и поклоняться Богу через Иисуса",
          "Рассказать другу о милости Иисуса"
        ],
        "answer": [
          2,
          1,
          4
        ],
        "hint": "Подумай, о чём прежде всего говорит каждая строка: о новой жизни, об обращении к Богу или о рассказе другим о Нём.",
        "truth": "Миша помолился и помог Бену встать, а Роза рассказала о доброте Иисуса. Их доброта была откликом на Божью милость."
      },
      {
        "title": "Милость, а не медаль",
        "paragraphs": [
          "Анна снова показала последнюю строку отрывка. «Пётр говорит, что Божьи люди помилованы. Наша доброта начинается не с того, какие мы хорошие, а с того, как добр к нам Бог».",
          "Промахнуться по мячу — не грех. Бену не нужно было просить прощения за проигрыш. Но всем им нужна была Божья милость за настоящие грехи: злые слова, поступки и желания. Бог милостив: вместо заслуженного наказания за грех Он предлагает прощение.",
          "Иисус умер за наши грехи и воскрес. Через Него Бог предлагает нам прощение. Мы обращаемся к Иисусу и доверяем Ему. Добротой нельзя заслужить спасение: добрые дела — наш отклик на Его милость, а не плата за неё.",
          "Миша вспомнил, как прошёл этот день. Помощью Бену он не купил себе место у Бога. Он попросил Бога о помощи, потому что уже доверял Иисусу. А потом, когда рядом расстроился другой человек, смог проявить доброту.",
          "Мише всё ещё хотелось, чтобы команда выиграла. Но домой он унёс не только воспоминание о счёте. Он принадлежал Иисусу и мог дальше учиться любить людей — даже когда день складывался не так, как хотелось."
        ],
        "talk": "Подумай в тишине: почему милость идёт раньше наших добрых дел? Любой вопрос можно обсудить со взрослым христианином, которому ты доверяешь.",
        "kind": "choice",
        "task": "В каком ответе сначала идёт дар, а потом наш отклик?",
        "options": [
          "Я добрый, поэтому Иисус обязан меня принять.",
          "Иисус дарит милость; доверяя Ему, я учусь жить как часть Его народа.",
          "Я хожу в церковь, поэтому мне больше не нужно прощение."
        ],
        "answer": [
          1
        ],
        "hint": "Дар принимают, а не покупают. Сначала милость, потом — наш отклик и новые поступки.",
        "truth": "Иисус принимает тех, кто обращается к Нему и доверяет Ему. Он дарит нам милость и учит Свой народ любить других."
      },
      {
        "title": "Запомни слова о милости",
        "paragraphs": [
          "Перед тем как друзья ушли, Анна предложила ещё раз прочитать слова Петра. Теперь Миша искал в них не способ заслужить Божье одобрение, а то, что Бог уже сделал для Своих людей.",
          "Не спеша прочитай отрывок ниже. В стихе 9 найди, как назван Божий народ и к чему Бог его призывает. В стихе 10 сравни, что было «некогда» и что стало «ныне». Что Бог подарил Своему народу?",
          "Когда будешь готов, открой задание. Отрывок скроется, и ты сможешь собрать стих 10 по памяти. Нажимай на части по порядку. Если нужно ещё раз прочитать стих, вернись к истории, а потом попробуй снова."
        ],
        "talk": "Что изменилось для Божьего народа?",
        "kind": "sequence",
        "task": "Собери 1 Петра 2:10 по памяти. Нажимай на части по порядку, затем проверь. Чтобы убрать выбранную часть, нажми на неё ещё раз.",
        "options": [
          "некогда непомилованные,",
          "некогда не народ,",
          "а ныне помилованы.",
          "а ныне народ Божий;"
        ],
        "answer": [
          1,
          3,
          0,
          2
        ],
        "hint": "Начни с того, что было некогда. Что стало ныне? Вторая пара — о милости.",
        "truth": "Бог сделал верующих Своим народом и помиловал их. Сначала Его дар, затем наш отклик."
      }
    ],
    "end": [
      "На следующей встрече Миша заметил, что у стола стоит кто-то новенький. Он вспомнил Бена и то, как сам ждал, пока его выберут. В этот раз Миша не стал ждать, пока Роза всё заметит. «Садись с нами», — сказал он и приветливо протянул руку. За столом с открытой Библией нашлось место для ещё одного друга.",
      "Сначала Миша спрашивал себя: «Кто я?» А теперь он задумался: «Чей я?» Ты тоже можешь подумать об этом. Если хочешь больше узнать о том, что значит принадлежать Иисусу, поговори со взрослым христианином, которому доверяешь. Он может выслушать тебя и помочь разобраться.",
      "Если хочешь обратиться к Иисусу, честно расскажи Ему о своём грехе, попроси прощения и доверь Ему своё спасение. Говори своими словами. Если ты уже доверяешь Ему, поблагодари за милость и попроси помочь тебе заботиться о тех, кого встретишь сегодня."
    ],
    "adult": [
      "Отведите примерно 20–30 минут или разделите урок на две встречи. Младшим детям читайте Библию и историю вслух. Останавливайтесь у вопросов: вдумчивый разговор важнее скорости. Восемь заданий помогают заметить ложные представления о своей ценности, применить прочитанное и вспомнить стих 10.",
      "1 Петра 2:9–10 обращено к общине верующих во Христе, а не безусловно к каждому зрителю. Род избранный, царственное священство, народ святой и люди, взятые в удел, — описания общины. «Свидетели» — название в нашем уроке для поручения возвещать Божьи совершенства, а не пятое существительное из цитаты.",
      "Доступ к Богу открыт через Иисуса, а не независимо от Него. Священство верующих не отменяет пастырской заботы. Святость — принадлежность Богу и изменённая жизнь, а не безгрешность. Добрые дела и посещение церкви не покупают новое положение перед Богом или спасение.",
      "Миша, Роза, Бен и Анна — герои вымышленной современной истории, а не библейского события. Доброта не гарантирует, что травля сразу прекратится. Не требуйте публичного решения о вере или рассказов о болезненном опыте. При необходимости помогите ребёнку обратиться к надёжному взрослому.",
      "Английская цитата — ESV; русская — Синодальный перевод (RST). Полный отрывок на обоих языках сохранён без изменений по проверенному источнику. Боковая панель сопоставляет чужие оценки с библейским учением; это не дополнительная цитата из Библии. На сайте история рассказана подробнее, чем в печатной книжке. Книжка и ответы к ней остаются отдельным кратким заданием."
    ]
  }
}
