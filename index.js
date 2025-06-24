const BASE_URL = "http://localhost:3000/posts";

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);

function displayPosts() {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((posts) => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      if (!posts.length) {
        document.getElementById("detail-title").textContent = "No posts available";
        document.getElementById("detail-content").textContent = "";
        document.getElementById("detail-author").textContent = "";
        return;
      }

      posts.forEach((post) => {
        const postItem = document.createElement("div");
        postItem.classList.add("post-item");
        postItem.textContent = post.title;
        postItem.dataset.id = post.id;

        postItem.addEventListener("click", () => {
          document.querySelectorAll(".post-item").forEach(item => item.classList.remove("selected"));
          postItem.classList.add("selected");
          handlePostClick(post.id);
        });

        postList.appendChild(postItem);
      });

      // Simulate first click
      const firstItem = postList.querySelector(".post-item");
      if (firstItem) firstItem.click();
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

function handlePostClick(postId) {
  fetch(`${BASE_URL}/${postId}`)
    .then((res) => res.json())
    .then((post) => {
      document.getElementById("detail-title").textContent = post.title;
      document.getElementById("detail-content").textContent = post.content;
      document.getElementById("detail-author").textContent = `By: ${post.author}`;

      const detail = document.getElementById("post-detail");
      // Remove previous buttons if any
      const oldBtns = detail.querySelectorAll("#edit-btn, #delete-btn");
      oldBtns.forEach(btn => btn.remove());

      // Add new buttons
      const editBtn = document.createElement("button");
      editBtn.id = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.onclick = () => setupEditForm(post);

      const deleteBtn = document.createElement("button");
      deleteBtn.id = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deletePost(post.id);

      detail.appendChild(editBtn);
      detail.appendChild(deleteBtn);
    })
    .catch((error) => console.error("Error loading post:", error));
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPost = {
      title: form.title.value.trim(),
      content: form.content.value.trim(),
      author: form.author.value.trim(),
    };

    if (!newPost.title || !newPost.content || !newPost.author) {
      alert("All fields are required.");
      return;
    }

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then(() => {
        form.reset();
        displayPosts();
      })
      .catch((error) => console.error("Error adding post:", error));
  });
}

function setupEditForm(post) {
  const editForm = document.getElementById("edit-post-form");
  const editTitle = document.getElementById("edit-title");
  const editContent = document.getElementById("edit-content");
  const editAuthor = document.getElementById("edit-author");

  editTitle.value = post.title;
  editContent.value = post.content;
  editAuthor.value = post.author;
  editForm.classList.remove("hidden");

  editForm.onsubmit = (e) => {
    e.preventDefault();

    const updatedPost = {
      title: editTitle.value.trim(),
      content: editContent.value.trim(),
      author: editAuthor.value.trim(),
    };

    fetch(`${BASE_URL}/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    })
      .then((res) => res.json())
      .then(() => {
        editForm.classList.add("hidden");
        displayPosts();
      })
      .catch((error) => console.error("Error updating post:", error));
  };

  document.getElementById("cancel-edit").onclick = () => {
    editForm.classList.add("hidden");
  };
}

function deletePost(postId) {
  fetch(`${BASE_URL}/${postId}`, { method: "DELETE" })
    .then(() => {
      displayPosts();
      document.getElementById("detail-title").textContent = "Select a post to view";
      document.getElementById("detail-content").textContent = "";
      document.getElementById("detail-author").textContent = "";
    })
    .catch((error) => console.error("Error deleting post:", error));
}