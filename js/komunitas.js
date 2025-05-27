
document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("postForm");
  const postInput = document.getElementById("postInput");
  const postList = document.getElementById("postList");

  const loadPosts = () => {
    postList.innerHTML = "";
    const posts = JSON.parse(localStorage.getItem("communityPosts") || "[]");

    posts.forEach((post, index) => {
      const realIndex = posts.length - 1 - index;
      const div = document.createElement("div");
      div.classList.add("comment");
      div.innerHTML = `
        <div class="content">
          <div class="author">${post.name || "Anonim"}</div>
          <div class="metadata"><span>${new Date(post.date).toLocaleString()}</span></div>
          <div class="text">${post.text}</div>
          <div class="actions">
            <a class="reply" onclick="toggleCommentForm(${realIndex})">Balas</a>
            <a class="delete" onclick="deletePost(${realIndex})">Hapus</a>
          </div>
          <div class="ui form reply-form" id="replyForm${realIndex}" style="display:none; margin-top: 10px;">
            <div class="field">
              <input type="text" placeholder="Tulis komentar..." id="replyInput${realIndex}" />
            </div>
            <button class="ui tiny button" onclick="addComment(${realIndex})">Kirim</button>
          </div>
          <div class="ui comments" id="commentList${realIndex}" style="margin-top:10px;"></div>
        </div>
      `;
      postList.insertBefore(div, postList.firstChild);

      const commentList = document.getElementById(`commentList${realIndex}`);
      (post.comments || []).forEach(comment => {
        const cdiv = document.createElement("div");
        cdiv.classList.add("comment");
        cdiv.innerHTML = `
          <div class="content">
            <div class="author">Anonim</div>
            <div class="text">${comment}</div>
          </div>
        `;
        commentList.appendChild(cdiv);
      });
    });
  };

  window.toggleCommentForm = (index) => {
    const form = document.getElementById(`replyForm${index}`);
    form.style.display = form.style.display === "none" ? "block" : "none";
  };

  window.addComment = (index) => {
    const input = document.getElementById(`replyInput${index}`);
    const comment = input.value.trim();
    if (!comment) return;
    const posts = JSON.parse(localStorage.getItem("communityPosts") || "[]");
    posts[index].comments = posts[index].comments || [];
    posts[index].comments.push(comment);
    localStorage.setItem("communityPosts", JSON.stringify(posts));
    loadPosts();
  };

  window.deletePost = (index) => {
    if (!confirm("Hapus postingan ini?")) return;
    const posts = JSON.parse(localStorage.getItem("communityPosts") || "[]");
    posts.splice(index, 1);
    localStorage.setItem("communityPosts", JSON.stringify(posts));
    loadPosts();
  };

  postForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = postInput.value.trim();
    if (!text) return;
    const posts = JSON.parse(localStorage.getItem("communityPosts") || "[]");
    posts.push({ text, date: new Date().toISOString(), comments: [] });
    localStorage.setItem("communityPosts", JSON.stringify(posts));
    postInput.value = "";
    loadPosts();
  });

  loadPosts();
});
