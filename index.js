const baseUrl = 'http://localhost:3000/posts';
let currentPostId = null;

// Fetch and display all post titles
function displayPosts() {
  fetch(baseUrl)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.classList.add('post-title');
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });
      if (posts.length > 0) handlePostClick(posts[0].id); // advanced deliverable
    });
}

// Show post details
function handlePostClick(postId) {
  fetch(`${baseUrl}/${postId}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;
      const detailDiv = document.getElementById('post-detail');
      detailDiv.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.image}" alt="post image" width="200"><br/>
        <p>${post.content}</p>
        <strong>By: ${post.author}</strong><br/><br/>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
      document.getElementById('delete-btn').addEventListener('click', deleteCurrentPost);
    });
}

// Add new post
function addNewPostListener() {
  document.getElementById('new-post-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;
    const image = document.getElementById('image').value || "https://via.placeholder.com/150";

    const newPost = { title, author, content, image };

    fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
    .then(() => {
      displayPosts();
      e.target.reset();
    });
  });
}

// Show edit form
function showEditForm(post) {
  const form = document.getElementById('edit-post-form');
  form.classList.remove('hidden');
  document.getElementById('edit-title').value = post.title;
  document.getElementById('edit-content').value = post.content;

  form.onsubmit = function (e) {
    e.preventDefault();
    const updatedPost = {
      title: document.getElementById('edit-title').value,
      content: document.getElementById('edit-content').value
    };

    fetch(`${baseUrl}/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
    .then(() => {
      form.classList.add('hidden');
      displayPosts();
      handlePostClick(post.id);
    });
  };

  document.getElementById('cancel-edit').onclick = () => {
    form.classList.add('hidden');
  };
}

// Delete current post
function deleteCurrentPost() {
  if (!currentPostId) return;

  fetch(`${baseUrl}/${currentPostId}`, {
    method: 'DELETE'
  }).then(() => {
    document.getElementById('post-detail').innerHTML = '<p>Select a post to see details</p>';
    displayPosts();
  });
}

// Start app
function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);