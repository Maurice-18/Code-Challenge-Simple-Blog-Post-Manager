const BASE_URL = 'http://localhost:3000';
const postListDiv = document.getElementById('post-list');
const postDetailDiv = document.getElementById('post-detail');
const newPostForm = document.getElementById('new-post-form');

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);

async function displayPosts() {
  const res = await fetch(`${BASE_URL}/posts`);
  const posts = await res.json();
  postListDiv.innerHTML = '';
  posts.forEach(post => {
    const div = document.createElement('div');
    div.textContent = post.title;
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => handlePostClick(post.id));
    postListDiv.appendChild(div);
  });
}

async function handlePostClick(postId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}`);
  const post = await res.json();

  postDetailDiv.innerHTML = `
    <h2>${post.title}</h2>
    <p><strong>Author:</strong> ${post.author}</p>
    <p>${post.content}</p>
    <img src="${post.image}" alt="${post.title}" width="150"/>
  `;
}

const editBtn = document.createElement('button');
editBtn.textContent = 'Edit Post';
editBtn.addEventListener('click', () => showEditForm(post));
postDetailDiv.appendChild(editBtn);

function showEditForm(post) {
  postDetailDiv.innerHTML = `
    <h3>Edit Post</h3>
    <form id="edit-post-form">
      <label>Title:</label>
      <input type="text" id="edit-title" value="${post.title}" required><br>
      <label>Content:</label>
      <textarea id="edit-content" required>${post.content}</textarea><br>
      <button type="submit">Save</button>
    </form>
  `;

  document.getElementById('edit-post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedTitle = document.getElementById('edit-title').value;
    const updatedContent = document.getElementById('edit-content').value;

    await fetch(`${BASE_URL}/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updatedTitle, content: updatedContent })
    });

    displayPosts();               
    handlePostClick(post.id);     
  });
}

const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'Delete Post';
deleteBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    await fetch(`${BASE_URL}/posts/${post.id}`, {
      method: 'DELETE'
    });
    displayPosts();
    postDetailDiv.innerHTML = '<p>Post deleted. Add a new one.</p>';
  }
});
postDetailDiv.appendChild(deleteBtn);


function addNewPostListener() {
  newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('new-post-title').value;
    const author = document.getElementById('new-post-author').value;
    const content = document.getElementById('new-post-content').value;
    const image = document.getElementById('new-post-image').value || 'https://via.placeholder.com/150';

    const newPost = { title, author, content, image };

    await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    displayPosts();
    newPostForm.reset();
  });
}
