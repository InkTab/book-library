import type { Shelf } from '../components/Bookshelf'

// Sample catalogue for the demo page. Prices are placeholders.
// In a real shop this comes from your database or API; see README.md for the mapping.
export const sampleShelves: Shelf[] = [
  {
    id: 'classics',
    label: 'Classic Fiction',
    books: [
      {
        id: 'pride-and-prejudice',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        price: 16.99,
        format: 'Hardcover',
        description:
          'Elizabeth Bennet trades barbs with the proud Mr Darcy while her mother schemes to marry off five daughters. A comedy of manners about first impressions and how wrong they can be.',
        spine: { color: '#57311a', height: 212, thickness: 39 },
      },
      {
        id: 'jane-eyre',
        title: 'Jane Eyre',
        author: 'Charlotte Brontë',
        price: 10.99,
        format: 'Paperback',
        description:
          'An orphaned governess finds work at Thornfield Hall and falls for its brooding master, whose house hides a secret. A fierce account of a woman insisting on her own worth.',
        spine: { color: '#89856a', height: 226, thickness: 47 },
      },
      {
        id: 'wuthering-heights',
        title: 'Wuthering Heights',
        author: 'Emily Brontë',
        price: 9.49,
        format: 'Paperback',
        description:
          'On the Yorkshire moors, the foundling Heathcliff and Catherine Earnshaw form a bond that curdles into revenge across two generations.',
        spine: { color: '#c1572f', height: 204, thickness: 36 },
      },
      {
        id: 'middlemarch',
        title: 'Middlemarch',
        author: 'George Eliot',
        price: 24.99,
        format: 'Hardcover',
        description:
          'Dorothea Brooke, the idealistic doctor Lydgate and a whole provincial town wrestle with marriage, money and reform in 1830s England.',
        spine: { color: '#1e3147', height: 238, thickness: 58 },
      },
      {
        id: 'great-expectations',
        title: 'Great Expectations',
        author: 'Charles Dickens',
        price: 11.49,
        format: 'Paperback',
        description:
          'Pip, a blacksmith’s boy, receives a fortune from an unknown benefactor and learns that becoming a gentleman costs more than he expected.',
        spine: { color: '#83644f', height: 218, thickness: 45 },
      },
      {
        id: 'moby-dick',
        title: 'Moby-Dick',
        author: 'Herman Melville',
        price: 22.99,
        format: 'Hardcover',
        description:
          'Ishmael signs on to the whaler Pequod, whose captain, Ahab, is hunting the white whale that took his leg.',
        spine: { color: '#cf7f5e', height: 232, thickness: 52 },
      },
      {
        id: 'anna-karenina',
        title: 'Anna Karenina',
        author: 'Leo Tolstoy',
        price: 23.99,
        format: 'Hardcover',
        description:
          'A married woman’s affair with Count Vronsky collides with the rigid society of imperial Russia, set against Levin’s search for meaning on his country estate.',
        spine: { color: '#d18730', height: 230, thickness: 56 },
      },
      {
        id: 'madame-bovary',
        title: 'Madame Bovary',
        author: 'Gustave Flaubert',
        price: 9.99,
        format: 'Paperback',
        description:
          'Emma Bovary, bored by her marriage to a country doctor, chases the romance she read about in novels, and runs up debts she cannot pay.',
        spine: { color: '#442614', height: 208, thickness: 34 },
      },
      {
        id: 'the-age-of-innocence',
        title: 'The Age of Innocence',
        author: 'Edith Wharton',
        price: 10.49,
        format: 'Paperback',
        description:
          'In 1870s New York, Newland Archer is engaged to the proper May Welland when her unconventional cousin Ellen Olenska returns from Europe.',
        spine: { color: '#1e3147', height: 214, thickness: 38 },
      },
      {
        id: 'persuasion',
        title: 'Persuasion',
        author: 'Jane Austen',
        price: 8.99,
        format: 'Paperback',
        description:
          'Eight years after being persuaded to break off her engagement, Anne Elliot meets Captain Wentworth again, now rich and seemingly indifferent.',
        spine: { color: '#c1572f', height: 200, thickness: 32 },
      },
      {
        id: 'emma',
        title: 'Emma',
        author: 'Jane Austen',
        price: 17.99,
        format: 'Hardcover',
        description:
          'Emma Woodhouse, handsome, clever and rich, meddles in her neighbours’ love lives in the village of Highbury, with mixed results.',
        spine: { color: '#4a4a32', height: 216, thickness: 43 },
      },
      {
        id: 'sense-and-sensibility',
        title: 'Sense and Sensibility',
        author: 'Jane Austen',
        price: 9.49,
        format: 'Paperback',
        description:
          'After their father’s death, the Dashwood sisters, sensible Elinor and passionate Marianne, face reduced circumstances and disappointing suitors.',
        spine: { color: '#dba25f', height: 206, thickness: 38 },
      },
      {
        id: 'north-and-south',
        title: 'North and South',
        author: 'Elizabeth Gaskell',
        price: 10.99,
        format: 'Paperback',
        description:
          'Margaret Hale moves from the rural south of England to an industrial northern town and clashes with the mill owner John Thornton.',
        spine: { color: '#c1572f', height: 222, thickness: 45 },
      },
      {
        id: 'cranford',
        title: 'Cranford',
        author: 'Elizabeth Gaskell',
        price: 8.49,
        format: 'Paperback',
        description:
          'Sketches of life in a small English town run largely by genteel, unmarried women of modest means.',
        spine: { color: '#89856a', height: 196, thickness: 27 },
      },
      {
        id: 'bleak-house',
        title: 'Bleak House',
        author: 'Charles Dickens',
        price: 25.99,
        format: 'Hardcover',
        description:
          'An endless inheritance case, Jarndyce and Jarndyce, draws in Esther Summerson and a huge cast in Dickens’s attack on the Court of Chancery.',
        spine: { color: '#1e3147', height: 240, thickness: 60 },
      },
      {
        id: 'a-tale-of-two-cities',
        title: 'A Tale of Two Cities',
        author: 'Charles Dickens',
        price: 9.99,
        format: 'Paperback',
        description:
          'London and Paris before and during the French Revolution, as Charles Darnay and Sydney Carton are bound together by their love for Lucie Manette.',
        spine: { color: '#83644f', height: 210, thickness: 38 },
      },
      {
        id: 'oliver-twist',
        title: 'Oliver Twist',
        author: 'Charles Dickens',
        price: 8.99,
        format: 'Paperback',
        description:
          'An orphan escapes the workhouse and falls in with Fagin’s gang of young pickpockets in London.',
        spine: { color: '#d18730', height: 204, thickness: 36 },
      },
      {
        id: 'tess-of-the-durbervilles',
        title: 'Tess of the d’Urbervilles',
        author: 'Thomas Hardy',
        price: 18.99,
        format: 'Hardcover',
        description:
          'A poor country girl’s family learns of its noble ancestry, setting off a chain of events she cannot escape.',
        spine: { color: '#c1572f', height: 220, thickness: 41 },
      },
      {
        id: 'far-from-the-madding-crowd',
        title: 'Far from the Madding Crowd',
        author: 'Thomas Hardy',
        price: 9.99,
        format: 'Paperback',
        description:
          'Bathsheba Everdene, an independent young farmer, is courted by three very different men in rural Wessex.',
        spine: { color: '#5f5f40', height: 212, thickness: 39 },
      },
      {
        id: 'vanity-fair',
        title: 'Vanity Fair',
        author: 'William Makepeace Thackeray',
        price: 21.99,
        format: 'Hardcover',
        description:
          'Ambitious Becky Sharp and gentle Amelia Sedley make their way through English society during the Napoleonic Wars.',
        spine: { color: '#442614', height: 234, thickness: 54 },
      },
      {
        id: 'les-miserables',
        title: 'Les Misérables',
        author: 'Victor Hugo',
        price: 27.99,
        format: 'Hardcover',
        description:
          'The ex-convict Jean Valjean tries to build an honest life while the policeman Javert pursues him, up to the 1832 Paris uprising.',
        spine: { color: '#cf7f5e', height: 242, thickness: 61 },
      },
      {
        id: 'the-hunchback-of-notre-dame',
        title: 'The Hunchback of Notre-Dame',
        author: 'Victor Hugo',
        price: 11.99,
        format: 'Paperback',
        description:
          'In fifteenth-century Paris, the bell-ringer Quasimodo, the archdeacon Frollo and the street dancer Esmeralda are bound together around the cathedral.',
        spine: { color: '#dba25f', height: 218, thickness: 43 },
      },
      {
        id: 'war-and-peace',
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        price: 29.99,
        format: 'Hardcover',
        description:
          'Several aristocratic families live through Napoleon’s invasion of Russia, from the ballrooms of St Petersburg to the battlefield of Borodino.',
        spine: { color: '#5a646f', height: 242, thickness: 62 },
      },
      {
        id: 'the-brothers-karamazov',
        title: 'The Brothers Karamazov',
        author: 'Fyodor Dostoevsky',
        price: 24.99,
        format: 'Hardcover',
        description:
          'Three brothers and their dissolute father are drawn into a murder case that tests faith, doubt and responsibility.',
        spine: { color: '#5f5f40', height: 236, thickness: 56 },
      },
      {
        id: 'fathers-and-sons',
        title: 'Fathers and Sons',
        author: 'Ivan Turgenev',
        price: 8.99,
        format: 'Paperback',
        description:
          'A young nihilist, Bazarov, visits a friend’s country estate and unsettles the older generation.',
        spine: { color: '#cf7f5e', height: 200, thickness: 30 },
      },
      {
        id: 'silas-marner',
        title: 'Silas Marner',
        author: 'George Eliot',
        price: 7.99,
        format: 'Paperback',
        description:
          'A reclusive weaver, robbed of his gold, finds his life changed when an orphaned child wanders into his cottage.',
        spine: { color: '#5a646f', height: 194, thickness: 27 },
      },
      {
        id: 'the-portrait-of-a-lady',
        title: 'The Portrait of a Lady',
        author: 'Henry James',
        price: 19.99,
        format: 'Hardcover',
        description:
          'Isabel Archer, a young American with a sudden fortune, goes to Europe determined to choose her own fate.',
        spine: { color: '#a36925', height: 226, thickness: 49 },
      },
      {
        id: 'the-house-of-mirth',
        title: 'The House of Mirth',
        author: 'Edith Wharton',
        price: 10.49,
        format: 'Paperback',
        description:
          'Lily Bart, beautiful but without money, tries to secure a place in New York high society before her time runs out.',
        spine: { color: '#cf7f5e', height: 212, thickness: 38 },
      },
      {
        id: 'the-scarlet-letter',
        title: 'The Scarlet Letter',
        author: 'Nathaniel Hawthorne',
        price: 8.49,
        format: 'Paperback',
        description:
          'In Puritan Boston, Hester Prynne is made to wear a scarlet A for adultery, and refuses to name her child’s father.',
        spine: { color: '#5f5f40', height: 202, thickness: 32 },
      },
      {
        id: 'ivanhoe',
        title: 'Ivanhoe',
        author: 'Walter Scott',
        price: 18.49,
        format: 'Hardcover',
        description:
          'A disinherited Saxon knight returns from the Crusades to an England divided between Normans and Saxons.',
        spine: { color: '#1e3147', height: 224, thickness: 47 },
      },
    ],
  },
  {
    id: 'mystery-adventure',
    label: 'Mystery, Gothic & Adventure',
    books: [
      {
        id: 'the-hound-of-the-baskervilles',
        title: 'The Hound of the Baskervilles',
        author: 'Arthur Conan Doyle',
        price: 8.99,
        format: 'Paperback',
        description:
          'A legend of a spectral hound haunts the Baskerville family, and Sherlock Holmes sends Watson to Dartmoor to protect the heir.',
        spine: { color: '#57311a', height: 210, thickness: 44 },
      },
      {
        id: 'the-sign-of-the-four',
        title: 'The Sign of the Four',
        author: 'Arthur Conan Doyle',
        price: 7.99,
        format: 'Paperback',
        description:
          'A young woman receives a pearl every year from an anonymous sender, and Holmes and Watson follow the trail to a stolen Indian treasure.',
        spine: { color: '#dba25f', height: 198, thickness: 35 },
      },
      {
        id: 'the-adventures-of-sherlock-holmes',
        title: 'The Adventures of Sherlock Holmes',
        author: 'Arthur Conan Doyle',
        price: 17.99,
        format: 'Hardcover',
        description:
          'Twelve short cases, including “A Scandal in Bohemia” and “The Red-Headed League”.',
        spine: { color: '#4a4a32', height: 222, thickness: 55 },
      },
      {
        id: 'the-moonstone',
        title: 'The Moonstone',
        author: 'Wilkie Collins',
        price: 10.99,
        format: 'Paperback',
        description:
          'A sacred Indian diamond vanishes on the night of a birthday party, and several narrators piece together what happened.',
        spine: { color: '#442614', height: 224, thickness: 55 },
      },
      {
        id: 'the-woman-in-white',
        title: 'The Woman in White',
        author: 'Wilkie Collins',
        price: 18.99,
        format: 'Hardcover',
        description:
          'A drawing teacher meets a mysterious woman in white on a moonlit road, and is drawn into a conspiracy of stolen identity.',
        spine: { color: '#172637', height: 232, thickness: 60 },
      },
      {
        id: 'the-mysterious-affair-at-styles',
        title: 'The Mysterious Affair at Styles',
        author: 'Agatha Christie',
        price: 8.99,
        format: 'Paperback',
        description:
          'Hercule Poirot’s first case: the wealthy mistress of Styles Court is poisoned, and everyone in the house has a motive.',
        spine: { color: '#a36925', height: 204, thickness: 44 },
      },
      {
        id: 'the-secret-adversary',
        title: 'The Secret Adversary',
        author: 'Agatha Christie',
        price: 8.99,
        format: 'Paperback',
        description:
          'Old friends Tommy and Tuppence go into business as adventurers and are drawn into a hunt for a missing secret treaty.',
        spine: { color: '#c1572f', height: 206, thickness: 44 },
      },
      {
        id: 'the-thirty-nine-steps',
        title: 'The Thirty-Nine Steps',
        author: 'John Buchan',
        price: 7.99,
        format: 'Paperback',
        description:
          'Richard Hannay finds a murdered spy in his London flat and goes on the run across Scotland, chased by police and enemy agents.',
        spine: { color: '#5f5f40', height: 198, thickness: 37 },
      },
      {
        id: 'dracula',
        title: 'Dracula',
        author: 'Bram Stoker',
        price: 19.99,
        format: 'Hardcover',
        description:
          'Told in letters and diaries, a Transylvanian count moves to England and a small band led by Van Helsing sets out to stop him.',
        spine: { color: '#dba25f', height: 228, thickness: 59 },
      },
      {
        id: 'frankenstein',
        title: 'Frankenstein',
        author: 'Mary Shelley',
        price: 8.49,
        format: 'Paperback',
        description:
          'Victor Frankenstein builds a living being from dead matter, then abandons it, and both pay for the act.',
        spine: { color: '#83644f', height: 206, thickness: 41 },
      },
      {
        id: 'carmilla',
        title: 'Carmilla',
        author: 'Sheridan Le Fanu',
        price: 6.99,
        format: 'Paperback',
        description:
          'A lonely young woman in a Styrian castle befriends a mysterious guest whose arrival coincides with a wave of illness.',
        spine: { color: '#172637', height: 188, thickness: 26 },
      },
      {
        id: 'the-castle-of-otranto',
        title: 'The Castle of Otranto',
        author: 'Horace Walpole',
        price: 7.49,
        format: 'Paperback',
        description:
          'A gigantic helmet falls from the sky and kills the heir of Otranto on his wedding day, in what is often called the first Gothic novel.',
        spine: { color: '#4a4a32', height: 192, thickness: 30 },
      },
      {
        id: 'strange-case-of-dr-jekyll-and-mr-hyde',
        title: 'Strange Case of Dr Jekyll and Mr Hyde',
        author: 'Robert Louis Stevenson',
        price: 7.99,
        format: 'Paperback',
        description:
          'A London lawyer investigates the link between his respectable friend Dr Jekyll and the violent Edward Hyde.',
        spine: { color: '#dba25f', height: 196, thickness: 35 },
      },
      {
        id: 'the-picture-of-dorian-gray',
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        price: 16.99,
        format: 'Hardcover',
        description:
          'A beautiful young man stays unchanged while his portrait ages and records every one of his sins.',
        spine: { color: '#c1572f', height: 214, thickness: 46 },
      },
      {
        id: 'the-turn-of-the-screw',
        title: 'The Turn of the Screw',
        author: 'Henry James',
        price: 7.49,
        format: 'Paperback',
        description:
          'A governess at a remote country house becomes convinced that the two children in her care are being visited by ghosts.',
        spine: { color: '#4a4a32', height: 192, thickness: 32 },
      },
      {
        id: 'the-time-machine',
        title: 'The Time Machine',
        author: 'H. G. Wells',
        price: 7.99,
        format: 'Paperback',
        description:
          'A Victorian inventor travels to the year 802,701 and finds humanity split into the gentle Eloi and the underground Morlocks.',
        spine: { color: '#a36925', height: 196, thickness: 35 },
      },
      {
        id: 'the-war-of-the-worlds',
        title: 'The War of the Worlds',
        author: 'H. G. Wells',
        price: 8.99,
        format: 'Paperback',
        description:
          'Martian cylinders land in Surrey, and tripod war machines lay waste to southern England.',
        spine: { color: '#974425', height: 210, thickness: 44 },
      },
      {
        id: 'twenty-thousand-leagues-under-the-seas',
        title: 'Twenty Thousand Leagues Under the Seas',
        author: 'Jules Verne',
        price: 19.99,
        format: 'Hardcover',
        description:
          'A professor and his companions are taken aboard Captain Nemo’s submarine, the Nautilus, for a voyage across the world’s oceans.',
        spine: { color: '#1e3147', height: 226, thickness: 55 },
      },
      {
        id: 'around-the-world-in-eighty-days',
        title: 'Around the World in Eighty Days',
        author: 'Jules Verne',
        price: 8.99,
        format: 'Paperback',
        description:
          'Phileas Fogg bets his fortune that he can circle the globe in eighty days, with his valet Passepartout and a detective on his trail.',
        spine: { color: '#5f5f40', height: 214, thickness: 46 },
      },
      {
        id: 'treasure-island',
        title: 'Treasure Island',
        author: 'Robert Louis Stevenson',
        price: 15.99,
        format: 'Hardcover',
        description:
          'Young Jim Hawkins finds a treasure map and sails with a crew that includes the charming, dangerous Long John Silver.',
        spine: { color: '#83644f', height: 206, thickness: 44 },
      },
      {
        id: 'kidnapped',
        title: 'Kidnapped',
        author: 'Robert Louis Stevenson',
        price: 8.49,
        format: 'Paperback',
        description:
          'Cheated of his inheritance, David Balfour is kidnapped onto a ship and escapes across the Scottish Highlands with the Jacobite Alan Breck.',
        spine: { color: '#a36925', height: 204, thickness: 41 },
      },
      {
        id: 'the-count-of-monte-cristo',
        title: 'The Count of Monte Cristo',
        author: 'Alexandre Dumas',
        price: 26.99,
        format: 'Hardcover',
        description:
          'Wrongly imprisoned for fourteen years, Edmond Dantès escapes, finds a hidden fortune and returns to Paris to take revenge.',
        spine: { color: '#4a4a32', height: 240, thickness: 72 },
      },
      {
        id: 'the-three-musketeers',
        title: 'The Three Musketeers',
        author: 'Alexandre Dumas',
        price: 11.99,
        format: 'Paperback',
        description:
          'Young d’Artagnan arrives in Paris and joins Athos, Porthos and Aramis in defending the queen’s honour against Cardinal Richelieu.',
        spine: { color: '#172637', height: 222, thickness: 57 },
      },
      {
        id: 'the-scarlet-pimpernel',
        title: 'The Scarlet Pimpernel',
        author: 'Baroness Orczy',
        price: 8.99,
        format: 'Paperback',
        description:
          'During the Reign of Terror, an English aristocrat who seems a fop secretly rescues French nobles from the guillotine.',
        spine: { color: '#442614', height: 202, thickness: 39 },
      },
      {
        id: 'the-prisoner-of-zenda',
        title: 'The Prisoner of Zenda',
        author: 'Anthony Hope',
        price: 7.99,
        format: 'Paperback',
        description:
          'An Englishman on holiday in Ruritania is persuaded to impersonate the kidnapped king, his distant cousin and double.',
        spine: { color: '#c1572f', height: 196, thickness: 32 },
      },
      {
        id: 'king-solomons-mines',
        title: 'King Solomon’s Mines',
        author: 'H. Rider Haggard',
        price: 8.49,
        format: 'Paperback',
        description:
          'Allan Quatermain leads an expedition into unmapped Africa in search of a lost brother and a legendary diamond mine.',
        spine: { color: '#172637', height: 204, thickness: 41 },
      },
      {
        id: 'gullivers-travels',
        title: 'Gulliver’s Travels',
        author: 'Jonathan Swift',
        price: 8.99,
        format: 'Paperback',
        description:
          'A ship’s surgeon washes up among the tiny Lilliputians, the giant Brobdingnagians and stranger nations, in a satire on human nature.',
        spine: { color: '#89856a', height: 208, thickness: 44 },
      },
      {
        id: 'robinson-crusoe',
        title: 'Robinson Crusoe',
        author: 'Daniel Defoe',
        price: 16.49,
        format: 'Hardcover',
        description:
          'Shipwrecked alone on an island, Crusoe builds a life from salvage and patience over twenty-eight years.',
        spine: { color: '#c1572f', height: 212, thickness: 48 },
      },
      {
        id: 'the-call-of-the-wild',
        title: 'The Call of the Wild',
        author: 'Jack London',
        price: 7.49,
        format: 'Paperback',
        description:
          'Buck, a pampered dog, is stolen and sold as a sled dog in the Klondike, where he learns to survive and answer the wild.',
        spine: { color: '#5a646f', height: 190, thickness: 30 },
      },
      {
        id: 'alices-adventures-in-wonderland',
        title: 'Alice’s Adventures in Wonderland',
        author: 'Lewis Carroll',
        price: 14.99,
        format: 'Hardcover',
        description:
          'Alice follows a white rabbit down a hole into a world of riddles, croquet with flamingos and a queen who wants everyone beheaded.',
        spine: { color: '#83644f', height: 194, thickness: 32 },
      },
    ],
  },
]
