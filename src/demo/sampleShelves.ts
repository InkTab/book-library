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
        spine: { color: '#7a2e3a', height: 212, thickness: 39 },
      },
      {
        id: 'jane-eyre',
        title: 'Jane Eyre',
        author: 'Charlotte Brontë',
        price: 10.99,
        format: 'Paperback',
        description:
          'An orphaned governess finds work at Thornfield Hall and falls for its brooding master, whose house hides a secret. A fierce account of a woman insisting on her own worth.',
        spine: { color: '#2f3e5c', height: 226, thickness: 47 },
      },
      {
        id: 'wuthering-heights',
        title: 'Wuthering Heights',
        author: 'Emily Brontë',
        price: 9.49,
        format: 'Paperback',
        description:
          'On the Yorkshire moors, the foundling Heathcliff and Catherine Earnshaw form a bond that curdles into revenge across two generations.',
        spine: { color: '#3d4a3a', height: 204, thickness: 36 },
      },
      {
        id: 'middlemarch',
        title: 'Middlemarch',
        author: 'George Eliot',
        price: 24.99,
        format: 'Hardcover',
        description:
          'Dorothea Brooke, the idealistic doctor Lydgate and a whole provincial town wrestle with marriage, money and reform in 1830s England.',
        spine: { color: '#b08a3e', height: 238, thickness: 58 },
      },
      {
        id: 'great-expectations',
        title: 'Great Expectations',
        author: 'Charles Dickens',
        price: 11.49,
        format: 'Paperback',
        description:
          'Pip, a blacksmith’s boy, receives a fortune from an unknown benefactor and learns that becoming a gentleman costs more than he expected.',
        spine: { color: '#5b3a6b', height: 218, thickness: 45 },
      },
      {
        id: 'moby-dick',
        title: 'Moby-Dick',
        author: 'Herman Melville',
        price: 22.99,
        format: 'Hardcover',
        description:
          'Ishmael signs on to the whaler Pequod, whose captain, Ahab, is hunting the white whale that took his leg.',
        spine: { color: '#1f4d5a', height: 232, thickness: 52 },
      },
      {
        id: 'anna-karenina',
        title: 'Anna Karenina',
        author: 'Leo Tolstoy',
        price: 23.99,
        format: 'Hardcover',
        description:
          'A married woman’s affair with Count Vronsky collides with the rigid society of imperial Russia, set against Levin’s search for meaning on his country estate.',
        spine: { color: '#9c3d2b', height: 230, thickness: 56 },
      },
      {
        id: 'madame-bovary',
        title: 'Madame Bovary',
        author: 'Gustave Flaubert',
        price: 9.99,
        format: 'Paperback',
        description:
          'Emma Bovary, bored by her marriage to a country doctor, chases the romance she read about in novels, and runs up debts she cannot pay.',
        spine: { color: '#c7a27a', height: 208, thickness: 34 },
      },
      {
        id: 'the-age-of-innocence',
        title: 'The Age of Innocence',
        author: 'Edith Wharton',
        price: 10.49,
        format: 'Paperback',
        description:
          'In 1870s New York, Newland Archer is engaged to the proper May Welland when her unconventional cousin Ellen Olenska returns from Europe.',
        spine: { color: '#4f6b52', height: 214, thickness: 38 },
      },
      {
        id: 'persuasion',
        title: 'Persuasion',
        author: 'Jane Austen',
        price: 8.99,
        format: 'Paperback',
        description:
          'Eight years after being persuaded to break off her engagement, Anne Elliot meets Captain Wentworth again, now rich and seemingly indifferent.',
        spine: { color: '#6e8296', height: 200, thickness: 32 },
      },
      {
        id: 'emma',
        title: 'Emma',
        author: 'Jane Austen',
        price: 17.99,
        format: 'Hardcover',
        description:
          'Emma Woodhouse, handsome, clever and rich, meddles in her neighbours’ love lives in the village of Highbury, with mixed results.',
        spine: { color: '#a35d6a', height: 216, thickness: 43 },
      },
      {
        id: 'sense-and-sensibility',
        title: 'Sense and Sensibility',
        author: 'Jane Austen',
        price: 9.49,
        format: 'Paperback',
        description:
          'After their father’s death, the Dashwood sisters, sensible Elinor and passionate Marianne, face reduced circumstances and disappointing suitors.',
        spine: { color: '#5c7a8a', height: 206, thickness: 38 },
      },
      {
        id: 'north-and-south',
        title: 'North and South',
        author: 'Elizabeth Gaskell',
        price: 10.99,
        format: 'Paperback',
        description:
          'Margaret Hale moves from the rural south of England to an industrial northern town and clashes with the mill owner John Thornton.',
        spine: { color: '#4a5560', height: 222, thickness: 45 },
      },
      {
        id: 'cranford',
        title: 'Cranford',
        author: 'Elizabeth Gaskell',
        price: 8.49,
        format: 'Paperback',
        description:
          'Sketches of life in a small English town run largely by genteel, unmarried women of modest means.',
        spine: { color: '#b7a17c', height: 196, thickness: 27 },
      },
      {
        id: 'bleak-house',
        title: 'Bleak House',
        author: 'Charles Dickens',
        price: 25.99,
        format: 'Hardcover',
        description:
          'An endless inheritance case, Jarndyce and Jarndyce, draws in Esther Summerson and a huge cast in Dickens’s attack on the Court of Chancery.',
        spine: { color: '#2d4535', height: 240, thickness: 60 },
      },
      {
        id: 'a-tale-of-two-cities',
        title: 'A Tale of Two Cities',
        author: 'Charles Dickens',
        price: 9.99,
        format: 'Paperback',
        description:
          'London and Paris before and during the French Revolution, as Charles Darnay and Sydney Carton are bound together by their love for Lucie Manette.',
        spine: { color: '#8e2a2a', height: 210, thickness: 38 },
      },
      {
        id: 'oliver-twist',
        title: 'Oliver Twist',
        author: 'Charles Dickens',
        price: 8.99,
        format: 'Paperback',
        description:
          'An orphan escapes the workhouse and falls in with Fagin’s gang of young pickpockets in London.',
        spine: { color: '#6b5840', height: 204, thickness: 36 },
      },
      {
        id: 'tess-of-the-durbervilles',
        title: 'Tess of the d’Urbervilles',
        author: 'Thomas Hardy',
        price: 18.99,
        format: 'Hardcover',
        description:
          'A poor country girl’s family learns of its noble ancestry, setting off a chain of events she cannot escape.',
        spine: { color: '#7d3f58', height: 220, thickness: 41 },
      },
      {
        id: 'far-from-the-madding-crowd',
        title: 'Far from the Madding Crowd',
        author: 'Thomas Hardy',
        price: 9.99,
        format: 'Paperback',
        description:
          'Bathsheba Everdene, an independent young farmer, is courted by three very different men in rural Wessex.',
        spine: { color: '#6f7f45', height: 212, thickness: 39 },
      },
      {
        id: 'vanity-fair',
        title: 'Vanity Fair',
        author: 'William Makepeace Thackeray',
        price: 21.99,
        format: 'Hardcover',
        description:
          'Ambitious Becky Sharp and gentle Amelia Sedley make their way through English society during the Napoleonic Wars.',
        spine: { color: '#c4793a', height: 234, thickness: 54 },
      },
      {
        id: 'les-miserables',
        title: 'Les Misérables',
        author: 'Victor Hugo',
        price: 27.99,
        format: 'Hardcover',
        description:
          'The ex-convict Jean Valjean tries to build an honest life while the policeman Javert pursues him, up to the 1832 Paris uprising.',
        spine: { color: '#2a3550', height: 242, thickness: 61 },
      },
      {
        id: 'the-hunchback-of-notre-dame',
        title: 'The Hunchback of Notre-Dame',
        author: 'Victor Hugo',
        price: 11.99,
        format: 'Paperback',
        description:
          'In fifteenth-century Paris, the bell-ringer Quasimodo, the archdeacon Frollo and the street dancer Esmeralda are bound together around the cathedral.',
        spine: { color: '#5e4a6e', height: 218, thickness: 43 },
      },
      {
        id: 'war-and-peace',
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        price: 29.99,
        format: 'Hardcover',
        description:
          'Several aristocratic families live through Napoleon’s invasion of Russia, from the ballrooms of St Petersburg to the battlefield of Borodino.',
        spine: { color: '#7a2a20', height: 242, thickness: 62 },
      },
      {
        id: 'the-brothers-karamazov',
        title: 'The Brothers Karamazov',
        author: 'Fyodor Dostoevsky',
        price: 24.99,
        format: 'Hardcover',
        description:
          'Three brothers and their dissolute father are drawn into a murder case that tests faith, doubt and responsibility.',
        spine: { color: '#3a3a46', height: 236, thickness: 56 },
      },
      {
        id: 'fathers-and-sons',
        title: 'Fathers and Sons',
        author: 'Ivan Turgenev',
        price: 8.99,
        format: 'Paperback',
        description:
          'A young nihilist, Bazarov, visits a friend’s country estate and unsettles the older generation.',
        spine: { color: '#8a9a7a', height: 200, thickness: 30 },
      },
      {
        id: 'silas-marner',
        title: 'Silas Marner',
        author: 'George Eliot',
        price: 7.99,
        format: 'Paperback',
        description:
          'A reclusive weaver, robbed of his gold, finds his life changed when an orphaned child wanders into his cottage.',
        spine: { color: '#9a6b3a', height: 194, thickness: 27 },
      },
      {
        id: 'the-portrait-of-a-lady',
        title: 'The Portrait of a Lady',
        author: 'Henry James',
        price: 19.99,
        format: 'Hardcover',
        description:
          'Isabel Archer, a young American with a sudden fortune, goes to Europe determined to choose her own fate.',
        spine: { color: '#3e6470', height: 226, thickness: 49 },
      },
      {
        id: 'the-house-of-mirth',
        title: 'The House of Mirth',
        author: 'Edith Wharton',
        price: 10.49,
        format: 'Paperback',
        description:
          'Lily Bart, beautiful but without money, tries to secure a place in New York high society before her time runs out.',
        spine: { color: '#c9a3a8', height: 212, thickness: 38 },
      },
      {
        id: 'the-scarlet-letter',
        title: 'The Scarlet Letter',
        author: 'Nathaniel Hawthorne',
        price: 8.49,
        format: 'Paperback',
        description:
          'In Puritan Boston, Hester Prynne is made to wear a scarlet A for adultery, and refuses to name her child’s father.',
        spine: { color: '#9e2b35', height: 202, thickness: 32 },
      },
      {
        id: 'ivanhoe',
        title: 'Ivanhoe',
        author: 'Walter Scott',
        price: 18.49,
        format: 'Hardcover',
        description:
          'A disinherited Saxon knight returns from the Crusades to an England divided between Normans and Saxons.',
        spine: { color: '#4d5e3a', height: 224, thickness: 47 },
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
        spine: { color: '#2b2b2b', height: 210, thickness: 44 },
      },
      {
        id: 'the-sign-of-the-four',
        title: 'The Sign of the Four',
        author: 'Arthur Conan Doyle',
        price: 7.99,
        format: 'Paperback',
        description:
          'A young woman receives a pearl every year from an anonymous sender, and Holmes and Watson follow the trail to a stolen Indian treasure.',
        spine: { color: '#5a2e2e', height: 198, thickness: 35 },
      },
      {
        id: 'the-adventures-of-sherlock-holmes',
        title: 'The Adventures of Sherlock Holmes',
        author: 'Arthur Conan Doyle',
        price: 17.99,
        format: 'Hardcover',
        description:
          'Twelve short cases, including “A Scandal in Bohemia” and “The Red-Headed League”.',
        spine: { color: '#24394f', height: 222, thickness: 55 },
      },
      {
        id: 'the-moonstone',
        title: 'The Moonstone',
        author: 'Wilkie Collins',
        price: 10.99,
        format: 'Paperback',
        description:
          'A sacred Indian diamond vanishes on the night of a birthday party, and several narrators piece together what happened.',
        spine: { color: '#c9b458', height: 224, thickness: 55 },
      },
      {
        id: 'the-woman-in-white',
        title: 'The Woman in White',
        author: 'Wilkie Collins',
        price: 18.99,
        format: 'Hardcover',
        description:
          'A drawing teacher meets a mysterious woman in white on a moonlit road, and is drawn into a conspiracy of stolen identity.',
        spine: { color: '#e3dccb', height: 232, thickness: 60 },
      },
      {
        id: 'the-mysterious-affair-at-styles',
        title: 'The Mysterious Affair at Styles',
        author: 'Agatha Christie',
        price: 8.99,
        format: 'Paperback',
        description:
          'Hercule Poirot’s first case: the wealthy mistress of Styles Court is poisoned, and everyone in the house has a motive.',
        spine: { color: '#a6553a', height: 204, thickness: 44 },
      },
      {
        id: 'the-secret-adversary',
        title: 'The Secret Adversary',
        author: 'Agatha Christie',
        price: 8.99,
        format: 'Paperback',
        description:
          'Old friends Tommy and Tuppence go into business as adventurers and are drawn into a hunt for a missing secret treaty.',
        spine: { color: '#3f6e8c', height: 206, thickness: 44 },
      },
      {
        id: 'the-thirty-nine-steps',
        title: 'The Thirty-Nine Steps',
        author: 'John Buchan',
        price: 7.99,
        format: 'Paperback',
        description:
          'Richard Hannay finds a murdered spy in his London flat and goes on the run across Scotland, chased by police and enemy agents.',
        spine: { color: '#365b8c', height: 198, thickness: 37 },
      },
      {
        id: 'dracula',
        title: 'Dracula',
        author: 'Bram Stoker',
        price: 19.99,
        format: 'Hardcover',
        description:
          'Told in letters and diaries, a Transylvanian count moves to England and a small band led by Van Helsing sets out to stop him.',
        spine: { color: '#6b1d24', height: 228, thickness: 59 },
      },
      {
        id: 'frankenstein',
        title: 'Frankenstein',
        author: 'Mary Shelley',
        price: 8.49,
        format: 'Paperback',
        description:
          'Victor Frankenstein builds a living being from dead matter, then abandons it, and both pay for the act.',
        spine: { color: '#41505e', height: 206, thickness: 41 },
      },
      {
        id: 'carmilla',
        title: 'Carmilla',
        author: 'Sheridan Le Fanu',
        price: 6.99,
        format: 'Paperback',
        description:
          'A lonely young woman in a Styrian castle befriends a mysterious guest whose arrival coincides with a wave of illness.',
        spine: { color: '#4a2a3a', height: 188, thickness: 26 },
      },
      {
        id: 'the-castle-of-otranto',
        title: 'The Castle of Otranto',
        author: 'Horace Walpole',
        price: 7.49,
        format: 'Paperback',
        description:
          'A gigantic helmet falls from the sky and kills the heir of Otranto on his wedding day, in what is often called the first Gothic novel.',
        spine: { color: '#5d5a4a', height: 192, thickness: 30 },
      },
      {
        id: 'strange-case-of-dr-jekyll-and-mr-hyde',
        title: 'Strange Case of Dr Jekyll and Mr Hyde',
        author: 'Robert Louis Stevenson',
        price: 7.99,
        format: 'Paperback',
        description:
          'A London lawyer investigates the link between his respectable friend Dr Jekyll and the violent Edward Hyde.',
        spine: { color: '#7d5a3c', height: 196, thickness: 35 },
      },
      {
        id: 'the-picture-of-dorian-gray',
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        price: 16.99,
        format: 'Hardcover',
        description:
          'A beautiful young man stays unchanged while his portrait ages and records every one of his sins.',
        spine: { color: '#3c6e6a', height: 214, thickness: 46 },
      },
      {
        id: 'the-turn-of-the-screw',
        title: 'The Turn of the Screw',
        author: 'Henry James',
        price: 7.49,
        format: 'Paperback',
        description:
          'A governess at a remote country house becomes convinced that the two children in her care are being visited by ghosts.',
        spine: { color: '#8a8f6a', height: 192, thickness: 32 },
      },
      {
        id: 'the-time-machine',
        title: 'The Time Machine',
        author: 'H. G. Wells',
        price: 7.99,
        format: 'Paperback',
        description:
          'A Victorian inventor travels to the year 802,701 and finds humanity split into the gentle Eloi and the underground Morlocks.',
        spine: { color: '#5f7f3f', height: 196, thickness: 35 },
      },
      {
        id: 'the-war-of-the-worlds',
        title: 'The War of the Worlds',
        author: 'H. G. Wells',
        price: 8.99,
        format: 'Paperback',
        description:
          'Martian cylinders land in Surrey, and tripod war machines lay waste to southern England.',
        spine: { color: '#8c2f2f', height: 210, thickness: 44 },
      },
      {
        id: 'twenty-thousand-leagues-under-the-seas',
        title: 'Twenty Thousand Leagues Under the Seas',
        author: 'Jules Verne',
        price: 19.99,
        format: 'Hardcover',
        description:
          'A professor and his companions are taken aboard Captain Nemo’s submarine, the Nautilus, for a voyage across the world’s oceans.',
        spine: { color: '#204a6e', height: 226, thickness: 55 },
      },
      {
        id: 'around-the-world-in-eighty-days',
        title: 'Around the World in Eighty Days',
        author: 'Jules Verne',
        price: 8.99,
        format: 'Paperback',
        description:
          'Phileas Fogg bets his fortune that he can circle the globe in eighty days, with his valet Passepartout and a detective on his trail.',
        spine: { color: '#4a7c8c', height: 214, thickness: 46 },
      },
      {
        id: 'treasure-island',
        title: 'Treasure Island',
        author: 'Robert Louis Stevenson',
        price: 15.99,
        format: 'Hardcover',
        description:
          'Young Jim Hawkins finds a treasure map and sails with a crew that includes the charming, dangerous Long John Silver.',
        spine: { color: '#c08a2e', height: 206, thickness: 44 },
      },
      {
        id: 'kidnapped',
        title: 'Kidnapped',
        author: 'Robert Louis Stevenson',
        price: 8.49,
        format: 'Paperback',
        description:
          'Cheated of his inheritance, David Balfour is kidnapped onto a ship and escapes across the Scottish Highlands with the Jacobite Alan Breck.',
        spine: { color: '#56704f', height: 204, thickness: 41 },
      },
      {
        id: 'the-count-of-monte-cristo',
        title: 'The Count of Monte Cristo',
        author: 'Alexandre Dumas',
        price: 26.99,
        format: 'Hardcover',
        description:
          'Wrongly imprisoned for fourteen years, Edmond Dantès escapes, finds a hidden fortune and returns to Paris to take revenge.',
        spine: { color: '#3b2f5e', height: 240, thickness: 72 },
      },
      {
        id: 'the-three-musketeers',
        title: 'The Three Musketeers',
        author: 'Alexandre Dumas',
        price: 11.99,
        format: 'Paperback',
        description:
          'Young d’Artagnan arrives in Paris and joins Athos, Porthos and Aramis in defending the queen’s honour against Cardinal Richelieu.',
        spine: { color: '#1f5a4f', height: 222, thickness: 57 },
      },
      {
        id: 'the-scarlet-pimpernel',
        title: 'The Scarlet Pimpernel',
        author: 'Baroness Orczy',
        price: 8.99,
        format: 'Paperback',
        description:
          'During the Reign of Terror, an English aristocrat who seems a fop secretly rescues French nobles from the guillotine.',
        spine: { color: '#a83232', height: 202, thickness: 39 },
      },
      {
        id: 'the-prisoner-of-zenda',
        title: 'The Prisoner of Zenda',
        author: 'Anthony Hope',
        price: 7.99,
        format: 'Paperback',
        description:
          'An Englishman on holiday in Ruritania is persuaded to impersonate the kidnapped king, his distant cousin and double.',
        spine: { color: '#6a7f9a', height: 196, thickness: 32 },
      },
      {
        id: 'king-solomons-mines',
        title: 'King Solomon’s Mines',
        author: 'H. Rider Haggard',
        price: 8.49,
        format: 'Paperback',
        description:
          'Allan Quatermain leads an expedition into unmapped Africa in search of a lost brother and a legendary diamond mine.',
        spine: { color: '#b0884a', height: 204, thickness: 41 },
      },
      {
        id: 'gullivers-travels',
        title: 'Gulliver’s Travels',
        author: 'Jonathan Swift',
        price: 8.99,
        format: 'Paperback',
        description:
          'A ship’s surgeon washes up among the tiny Lilliputians, the giant Brobdingnagians and stranger nations, in a satire on human nature.',
        spine: { color: '#b5654a', height: 208, thickness: 44 },
      },
      {
        id: 'robinson-crusoe',
        title: 'Robinson Crusoe',
        author: 'Daniel Defoe',
        price: 16.49,
        format: 'Hardcover',
        description:
          'Shipwrecked alone on an island, Crusoe builds a life from salvage and patience over twenty-eight years.',
        spine: { color: '#6d5a3b', height: 212, thickness: 48 },
      },
      {
        id: 'the-call-of-the-wild',
        title: 'The Call of the Wild',
        author: 'Jack London',
        price: 7.49,
        format: 'Paperback',
        description:
          'Buck, a pampered dog, is stolen and sold as a sled dog in the Klondike, where he learns to survive and answer the wild.',
        spine: { color: '#7a8a9a', height: 190, thickness: 30 },
      },
      {
        id: 'alices-adventures-in-wonderland',
        title: 'Alice’s Adventures in Wonderland',
        author: 'Lewis Carroll',
        price: 14.99,
        format: 'Hardcover',
        description:
          'Alice follows a white rabbit down a hole into a world of riddles, croquet with flamingos and a queen who wants everyone beheaded.',
        spine: { color: '#d08aa0', height: 194, thickness: 32 },
      },
    ],
  },
  {
    id: 'modern',
    label: 'Modern & World Literature',
    books: [
      {
        id: 'mrs-dalloway',
        title: 'Mrs Dalloway',
        author: 'Virginia Woolf',
        price: 9.49,
        format: 'Paperback',
        description:
          'A single June day in London as Clarissa Dalloway prepares for a party, her thoughts intertwined with those of a shell-shocked veteran.',
        spine: { color: '#9fb3a6', height: 204, thickness: 39 },
      },
      {
        id: 'to-the-lighthouse',
        title: 'To the Lighthouse',
        author: 'Virginia Woolf',
        price: 9.99,
        format: 'Paperback',
        description:
          'The Ramsay family’s summers at their house on the Isle of Skye, before and after the First World War.',
        spine: { color: '#5d8aa0', height: 206, thickness: 41 },
      },
      {
        id: 'a-room-of-ones-own',
        title: 'A Room of One’s Own',
        author: 'Virginia Woolf',
        price: 7.99,
        format: 'Paperback',
        description:
          'Woolf’s essay arguing that a woman must have money and a room of her own if she is to write fiction.',
        spine: { color: '#d9b98a', height: 190, thickness: 28 },
      },
      {
        id: 'the-great-gatsby',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 15.99,
        format: 'Hardcover',
        description:
          'Nick Carraway watches his mysterious neighbour Jay Gatsby throw lavish parties in pursuit of Daisy Buchanan.',
        spine: { color: '#1e3a5f', height: 198, thickness: 35 },
      },
      {
        id: 'the-sun-also-rises',
        title: 'The Sun Also Rises',
        author: 'Ernest Hemingway',
        price: 9.99,
        format: 'Paperback',
        description:
          'American and British expatriates drift from the cafés of Paris to the bullfights of Pamplona.',
        spine: { color: '#c56b3c', height: 202, thickness: 39 },
      },
      {
        id: 'ulysses',
        title: 'Ulysses',
        author: 'James Joyce',
        price: 28.99,
        format: 'Hardcover',
        description:
          'Leopold Bloom wanders Dublin on 16 June 1904, in a novel that tries almost every way of writing a day.',
        spine: { color: '#2d6a8a', height: 240, thickness: 73 },
      },
      {
        id: 'dubliners',
        title: 'Dubliners',
        author: 'James Joyce',
        price: 8.99,
        format: 'Paperback',
        description:
          'Fifteen stories of ordinary Dublin lives, ending with “The Dead”.',
        spine: { color: '#4f6f4a', height: 200, thickness: 37 },
      },
      {
        id: 'the-metamorphosis',
        title: 'The Metamorphosis',
        author: 'Franz Kafka',
        price: 6.99,
        format: 'Paperback',
        description:
          'Gregor Samsa wakes to find himself transformed into a giant insect, and his family must decide what he now is to them.',
        spine: { color: '#b9a37a', height: 188, thickness: 28 },
      },
      {
        id: 'the-trial',
        title: 'The Trial',
        author: 'Franz Kafka',
        price: 9.49,
        format: 'Paperback',
        description:
          'Josef K. is arrested one morning without being told his crime, and struggles against a court he can never reach.',
        spine: { color: '#3d3d3d', height: 204, thickness: 41 },
      },
      {
        id: 'heart-of-darkness',
        title: 'Heart of Darkness',
        author: 'Joseph Conrad',
        price: 7.49,
        format: 'Paperback',
        description:
          'Marlow travels up the Congo River in search of Kurtz, an ivory trader who has gone beyond all restraint.',
        spine: { color: '#2e3b2a', height: 192, thickness: 30 },
      },
      {
        id: 'a-passage-to-india',
        title: 'A Passage to India',
        author: 'E. M. Forster',
        price: 17.49,
        format: 'Hardcover',
        description:
          'An incident in the Marabar Caves sets British and Indians against each other in a colonial city.',
        spine: { color: '#b38b4d', height: 218, thickness: 50 },
      },
      {
        id: 'sons-and-lovers',
        title: 'Sons and Lovers',
        author: 'D. H. Lawrence',
        price: 10.49,
        format: 'Paperback',
        description:
          'Paul Morel grows up in a Nottinghamshire mining family, torn between his mother and the women he loves.',
        spine: { color: '#7a4a3a', height: 214, thickness: 50 },
      },
      {
        id: 'of-human-bondage',
        title: 'Of Human Bondage',
        author: 'W. Somerset Maugham',
        price: 21.99,
        format: 'Hardcover',
        description:
          'Philip Carey, born with a club foot, searches for his vocation and is consumed by an unhappy passion.',
        spine: { color: '#55607a', height: 232, thickness: 66 },
      },
      {
        id: 'the-awakening',
        title: 'The Awakening',
        author: 'Kate Chopin',
        price: 7.99,
        format: 'Paperback',
        description:
          'On holiday at Grand Isle, Edna Pontellier begins to question her life as a wife and mother in 1890s Louisiana.',
        spine: { color: '#7fa0a0', height: 194, thickness: 30 },
      },
      {
        id: 'my-antonia',
        title: 'My Ántonia',
        author: 'Willa Cather',
        price: 9.49,
        format: 'Paperback',
        description:
          'Jim Burden recalls growing up on the Nebraska prairie alongside Ántonia Shimerda, the daughter of Bohemian immigrants.',
        spine: { color: '#c4a052', height: 206, thickness: 41 },
      },
      {
        id: 'main-street',
        title: 'Main Street',
        author: 'Sinclair Lewis',
        price: 10.99,
        format: 'Paperback',
        description:
          'Carol Kennicott tries to bring culture and reform to the small Minnesota town of Gopher Prairie.',
        spine: { color: '#8a5a5a', height: 216, thickness: 50 },
      },
      {
        id: 'the-jungle',
        title: 'The Jungle',
        author: 'Upton Sinclair',
        price: 10.49,
        format: 'Paperback',
        description:
          'A Lithuanian immigrant family is ground down by the meatpacking plants and slums of Chicago.',
        spine: { color: '#5a6a3a', height: 212, thickness: 48 },
      },
      {
        id: 'little-women',
        title: 'Little Women',
        author: 'Louisa May Alcott',
        price: 16.99,
        format: 'Hardcover',
        description:
          'The four March sisters, Meg, Jo, Beth and Amy, grow up in Civil War-era Massachusetts.',
        spine: { color: '#c58fa0', height: 216, thickness: 50 },
      },
      {
        id: 'crime-and-punishment',
        title: 'Crime and Punishment',
        author: 'Fyodor Dostoevsky',
        price: 22.99,
        format: 'Hardcover',
        description:
          'A destitute student in St Petersburg commits a murder he believes is justified, then cannot escape his conscience or a patient detective.',
        spine: { color: '#4b4b4b', height: 230, thickness: 63 },
      },
      {
        id: 'the-idiot',
        title: 'The Idiot',
        author: 'Fyodor Dostoevsky',
        price: 12.49,
        format: 'Paperback',
        description:
          'Prince Myshkin, a good and guileless man, returns to St Petersburg society and is caught between two women.',
        spine: { color: '#6a4a7a', height: 226, thickness: 59 },
      },
      {
        id: 'don-quixote',
        title: 'Don Quixote',
        author: 'Miguel de Cervantes',
        price: 26.49,
        format: 'Hardcover',
        description:
          'An aging gentleman, his head full of chivalric romances, sets out as a knight-errant with his squire Sancho Panza.',
        spine: { color: '#a8432f', height: 236, thickness: 69 },
      },
      {
        id: 'candide',
        title: 'Candide',
        author: 'Voltaire',
        price: 6.99,
        format: 'Paperback',
        description:
          'Expelled from a castle, the naive Candide travels the world and learns that this may not be the best of all possible worlds.',
        spine: { color: '#d4c08a', height: 188, thickness: 28 },
      },
      {
        id: 'siddhartha',
        title: 'Siddhartha',
        author: 'Hermann Hesse',
        price: 8.49,
        format: 'Paperback',
        description:
          'In the time of the Buddha, a young Brahmin leaves home to search for enlightenment by his own path.',
        spine: { color: '#d28a4a', height: 196, thickness: 32 },
      },
      {
        id: 'the-prophet',
        title: 'The Prophet',
        author: 'Kahlil Gibran',
        price: 13.99,
        format: 'Hardcover',
        description:
          'Before leaving the city of Orphalese, the prophet Almustafa speaks to its people on love, work, freedom and death.',
        spine: { color: '#3a5a6a', height: 190, thickness: 30 },
      },
      {
        id: 'the-waste-land-and-other-poems',
        title: 'The Waste Land and Other Poems',
        author: 'T. S. Eliot',
        price: 8.99,
        format: 'Paperback',
        description:
          'Eliot’s 1922 poem of a fractured post-war world, collaging voices, myths and languages, with his earlier poems.',
        spine: { color: '#9a9a8a', height: 198, thickness: 32 },
      },
      {
        id: 'leaves-of-grass',
        title: 'Leaves of Grass',
        author: 'Walt Whitman',
        price: 19.99,
        format: 'Hardcover',
        description:
          'Whitman’s expansive free verse celebrates the body, democracy and the ordinary people of America.',
        spine: { color: '#5a6b2f', height: 218, thickness: 50 },
      },
      {
        id: 'walden',
        title: 'Walden',
        author: 'Henry David Thoreau',
        price: 9.99,
        format: 'Paperback',
        description:
          'Thoreau’s account of two years in a cabin by Walden Pond, on living simply and deliberately.',
        spine: { color: '#46664a', height: 210, thickness: 43 },
      },
      {
        id: 'meditations',
        title: 'Meditations',
        author: 'Marcus Aurelius',
        price: 14.99,
        format: 'Hardcover',
        description:
          'The Roman emperor’s private notes to himself on duty, self-discipline and accepting what cannot be changed.',
        spine: { color: '#6e5a46', height: 200, thickness: 37 },
      },
      {
        id: 'the-prince',
        title: 'The Prince',
        author: 'Niccolò Machiavelli',
        price: 6.99,
        format: 'Paperback',
        description:
          'A short treatise on how rulers gain and keep power, written in 1513 and still argued over.',
        spine: { color: '#2f2f3f', height: 190, thickness: 28 },
      },
      {
        id: 'the-odyssey',
        title: 'The Odyssey',
        author: 'Homer',
        price: 18.99,
        format: 'Hardcover',
        description:
          'After the fall of Troy, Odysseus spends ten years fighting his way home to Ithaca, where suitors are courting his wife.',
        spine: { color: '#2e5e5a', height: 222, thickness: 52 },
      },
    ],
  },
]
