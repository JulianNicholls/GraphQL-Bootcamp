// Dummy data
const users = [
  {
    id: '10',
    name: 'Julian',
    email: 'julian@example.com',
    age: 47,
  },
  { id: '11', name: 'Sarah', email: 'sarah@example.com' },
  { id: '12', name: 'Mike', email: 'mike@example.com' },
];

const posts = [
  {
    id: '1',
    title: 'First post',
    body: 'This is a body',
    published: true,
    author: '10',
  },
  {
    id: '2',
    title: 'Second post',
    body: 'The body in the library',
    published: false,
    author: '10',
  },
  {
    id: '3',
    title: 'Third post',
    body: 'Ugly bodies',
    published: true,
    author: '11',
  },
];

const comments = [
  { id: '21', text: 'First comment', post: '1', author: '12' },
  { id: '22', text: 'Great post', post: '1', author: '11' },
  { id: '23', text: 'This stinks', post: '2', author: '12' },
  { id: '24', text: 'What a crock', post: '3', author: '10' },
  { id: '25', text: 'Untouchable', post: '3', author: '12' },
  { id: '26', text: 'A final one to delete', post: '3', author: '11' },
];

const db = { users, posts, comments };

export default db;
