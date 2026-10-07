export interface Book {
  id: string
  title: string
  author: string
  description: string
  /** Price in the shop's currency (see `formatPrice`). */
  price: number
  /** Cloth colour of the binding. */
  color: string
  /** Spine height on the shelf, in px. */
  height: number
  /** Spine thickness on the shelf, in px. */
  thickness: number
}

export interface Shelf {
  id: string
  label: string
  books: Book[]
}

const priceFormat = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
export const formatPrice = (price: number) => priceFormat.format(price)

type Row = [title: string, author: string, price: number, color: string, height: number, thickness: number, description: string]

const toBooks = (shelfId: string, rows: Row[]): Book[] =>
  rows.map(([title, author, price, color, height, thickness, description], i) => ({
    id: `${shelfId}-${i}`,
    title,
    author,
    price,
    color,
    height,
    thickness,
    description,
  }))

// Sample stock. Prices are placeholders.
export const shelves: Shelf[] = [
  {
    id: 'classics',
    label: 'Classics',
    books: toBooks('classics', [
      ['Pride and Prejudice', 'Jane Austen', 9.99, '#7a2e3a', 212, 44,
        'Elizabeth Bennet trades barbs with the proud Mr Darcy while her mother schemes to marry off five daughters. A comedy of manners about first impressions and how wrong they can be.'],
      ['Jane Eyre', 'Charlotte Brontë', 10.99, '#2f3e5c', 226, 52,
        'An orphaned governess finds work at Thornfield Hall and falls for its brooding master, whose house hides a secret. A fierce account of a woman insisting on her own worth.'],
      ['Wuthering Heights', 'Emily Brontë', 9.49, '#3d4a3a', 204, 40,
        'On the Yorkshire moors, the foundling Heathcliff and Catherine Earnshaw form a bond that curdles into revenge across two generations.'],
      ['Middlemarch', 'George Eliot', 14.99, '#b08a3e', 238, 64,
        'Dorothea Brooke, the idealistic doctor Lydgate and a whole provincial town wrestle with marriage, money and reform in 1830s England.'],
      ['Great Expectations', 'Charles Dickens', 11.49, '#5b3a6b', 218, 50,
        'Pip, a blacksmith’s boy, receives a fortune from an unknown benefactor and learns that becoming a gentleman costs more than he expected.'],
      ['Moby-Dick', 'Herman Melville', 12.99, '#1f4d5a', 232, 58,
        'Ishmael signs on to the whaler Pequod, whose captain, Ahab, is hunting the white whale that took his leg.'],
      ['Anna Karenina', 'Leo Tolstoy', 13.99, '#9c3d2b', 230, 62,
        'A married woman’s affair with Count Vronsky collides with the rigid society of imperial Russia, set against Levin’s search for meaning on his country estate.'],
      ['Madame Bovary', 'Gustave Flaubert', 9.99, '#c7a27a', 208, 38,
        'Emma Bovary, bored by her marriage to a country doctor, chases the romance she read about in novels, and runs up debts she cannot pay.'],
      ['The Age of Innocence', 'Edith Wharton', 10.49, '#4f6b52', 214, 42,
        'In 1870s New York, Newland Archer is engaged to the proper May Welland when her unconventional cousin Ellen Olenska returns from Europe.'],
      ['Persuasion', 'Jane Austen', 8.99, '#6e8296', 200, 36,
        'Eight years after being persuaded to break off her engagement, Anne Elliot meets Captain Wentworth again, now rich and seemingly indifferent.'],
    ]),
  },
  {
    id: 'mystery',
    label: 'Mystery & Gothic',
    books: toBooks('mystery', [
      ['The Hound of the Baskervilles', 'Arthur Conan Doyle', 8.99, '#2b2b2b', 210, 40,
        'A legend of a spectral hound haunts the Baskerville family, and Sherlock Holmes sends Watson to Dartmoor to protect the heir.'],
      ['The Moonstone', 'Wilkie Collins', 10.99, '#c9b458', 224, 50,
        'A sacred Indian diamond vanishes on the night of a birthday party, and several narrators piece together what happened.'],
      ['Dracula', 'Bram Stoker', 9.99, '#6b1d24', 228, 54,
        'Told in letters and diaries, a Transylvanian count moves to England and a small band led by Van Helsing sets out to stop him.'],
      ['Frankenstein', 'Mary Shelley', 8.49, '#41505e', 206, 38,
        'Victor Frankenstein builds a living being from dead matter, then abandons it, and both pay for the act.'],
      ['The Woman in White', 'Wilkie Collins', 11.49, '#e3dccb', 232, 56,
        'A drawing teacher meets a mysterious woman in white on a moonlit road, and is drawn into a conspiracy of stolen identity.'],
      ['Strange Case of Dr Jekyll and Mr Hyde', 'Robert Louis Stevenson', 7.99, '#7d5a3c', 196, 32,
        'A London lawyer investigates the link between his respectable friend Dr Jekyll and the violent Edward Hyde.'],
      ['The Picture of Dorian Gray', 'Oscar Wilde', 8.99, '#3c6e6a', 214, 42,
        'A beautiful young man stays unchanged while his portrait ages and records every one of his sins.'],
      ['The Turn of the Screw', 'Henry James', 7.49, '#8a8f6a', 192, 30,
        'A governess at a remote country house becomes convinced that the two children in her care are being visited by ghosts.'],
      ['The Mysterious Affair at Styles', 'Agatha Christie', 8.99, '#a6553a', 204, 40,
        'Hercule Poirot’s first case: the wealthy mistress of Styles Court is poisoned, and everyone in the house has a motive.'],
      ['The Thirty-Nine Steps', 'John Buchan', 7.99, '#365b8c', 198, 34,
        'Richard Hannay finds a murdered spy in his London flat and goes on the run across Scotland, chased by police and enemy agents.'],
    ]),
  },
  {
    id: 'adventure',
    label: 'Adventure & Speculative',
    books: toBooks('adventure', [
      ['The Time Machine', 'H. G. Wells', 7.99, '#5f7f3f', 196, 32,
        'A Victorian inventor travels to the year 802,701 and finds humanity split into the gentle Eloi and the underground Morlocks.'],
      ['The War of the Worlds', 'H. G. Wells', 8.99, '#8c2f2f', 210, 40,
        'Martian cylinders land in Surrey, and tripod war machines lay waste to southern England.'],
      ['Twenty Thousand Leagues Under the Seas', 'Jules Verne', 10.99, '#204a6e', 226, 50,
        'A professor and his companions are taken aboard Captain Nemo’s submarine, the Nautilus, for a voyage across the world’s oceans.'],
      ['Treasure Island', 'Robert Louis Stevenson', 8.49, '#c08a2e', 206, 40,
        'Young Jim Hawkins finds a treasure map and sails with a crew that includes the charming, dangerous Long John Silver.'],
      ['Around the World in Eighty Days', 'Jules Verne', 8.99, '#4a7c8c', 214, 42,
        'Phileas Fogg bets his fortune that he can circle the globe in eighty days, with his valet Passepartout and a detective on his trail.'],
      ['The Count of Monte Cristo', 'Alexandre Dumas', 15.99, '#3b2f5e', 240, 66,
        'Wrongly imprisoned for fourteen years, Edmond Dantès escapes, finds a hidden fortune and returns to Paris to take revenge.'],
      ['Gulliver’s Travels', 'Jonathan Swift', 8.99, '#b5654a', 208, 40,
        'A ship’s surgeon washes up among the tiny Lilliputians, the giant Brobdingnagians and stranger nations, in a satire on human nature.'],
      ['Robinson Crusoe', 'Daniel Defoe', 8.49, '#6d5a3b', 212, 44,
        'Shipwrecked alone on an island, Crusoe builds a life from salvage and patience over twenty-eight years.'],
      ['The Call of the Wild', 'Jack London', 7.49, '#7a8a9a', 190, 28,
        'Buck, a pampered dog, is stolen and sold as a sled dog in the Klondike, where he learns to survive and answer the wild.'],
      ['Alice’s Adventures in Wonderland', 'Lewis Carroll', 7.99, '#d08aa0', 194, 30,
        'Alice follows a white rabbit down a hole into a world of riddles, croquet with flamingos and a queen who wants everyone beheaded.'],
    ]),
  },
  {
    id: 'modern',
    label: 'Modern & World',
    books: toBooks('modern', [
      ['Mrs Dalloway', 'Virginia Woolf', 9.49, '#9fb3a6', 204, 36,
        'A single June day in London as Clarissa Dalloway prepares for a party, her thoughts intertwined with those of a shell-shocked veteran.'],
      ['The Great Gatsby', 'F. Scott Fitzgerald', 8.99, '#1e3a5f', 198, 32,
        'Nick Carraway watches his mysterious neighbour Jay Gatsby throw lavish parties in pursuit of Daisy Buchanan.'],
      ['Ulysses', 'James Joyce', 16.99, '#2d6a8a', 240, 68,
        'Leopold Bloom wanders Dublin on 16 June 1904, in a novel that tries almost every way of writing a day.'],
      ['The Metamorphosis', 'Franz Kafka', 6.99, '#b9a37a', 188, 26,
        'Gregor Samsa wakes to find himself transformed into a giant insect, and his family must decide what he now is to them.'],
      ['Leaves of Grass', 'Walt Whitman', 11.99, '#5a6b2f', 218, 46,
        'Whitman’s expansive free verse celebrates the body, democracy and the ordinary people of America.'],
      ['Walden', 'Henry David Thoreau', 9.99, '#46664a', 210, 40,
        'Thoreau’s account of two years in a cabin by Walden Pond, on living simply and deliberately.'],
      ['Crime and Punishment', 'Fyodor Dostoevsky', 12.99, '#4b4b4b', 230, 58,
        'A destitute student in St Petersburg commits a murder he believes is justified, then cannot escape his conscience or a patient detective.'],
      ['Don Quixote', 'Miguel de Cervantes', 15.49, '#a8432f', 236, 64,
        'An aging gentleman, his head full of chivalric romances, sets out as a knight-errant with his squire Sancho Panza.'],
      ['Little Women', 'Louisa May Alcott', 9.99, '#c58fa0', 216, 46,
        'The four March sisters, Meg, Jo, Beth and Amy, grow up in Civil War-era Massachusetts.'],
      ['The Odyssey', 'Homer', 10.99, '#2e5e5a', 222, 48,
        'After the fall of Troy, Odysseus spends ten years fighting his way home to Ithaca, where suitors are courting his wife.'],
    ]),
  },
]
