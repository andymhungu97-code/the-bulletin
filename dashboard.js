async function createPost() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;
    const files = document.getElementById("images").files;
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
  
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: formData
    });
  
    if (res.ok) {
      alert("Post created!");
      window.location.reload();
    } else {
      alert("Failed to create post");
    }
  }