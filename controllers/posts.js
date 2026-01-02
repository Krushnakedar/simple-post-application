import Post from "../models/post.js";

export async function renderAllPost(req, res) {
  const allPosts = await Post.find({}).populate("created_by");

  res.render("posts/desktop.ejs", { allPosts });
}

export async function renderNewForm(req, res) {
  res.render("posts/new.ejs");
}

export async function createPost(req, res) {
  let { heading, text } = req.body;

  console.log(heading);
  console.log(text);
  console.log(req.session.userId);
  let owner = req.session.userId;
  const newPost = new Post({
    heading: heading,
    text: text,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: owner,
  });

  let savedPost = await newPost.save();
  console.log(savedPost);
  res.redirect("/posts");
}

export async function renderEditForm(req, res) {
  let { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    res.redirect("/posts");
  } else {
    res.render("posts/edit.ejs", { post });
  }
}
export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { heading, text } = req.body;

    await Post.findByIdAndUpdate(
      id,
      {
        heading,
        text,
        updated_at: new Date(),
      },
      { runValidators: true }
    );

    res.redirect(`/posts/${id}`);
  } catch (err) {
    console.error(err);
    res.redirect("/posts");
  }
}

export async function showPost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("created_by");
    if (!post) {
      console.log(post);
      return res.redirect("/posts");
    }
    res.render("posts/show.ejs", { post });
  } catch (err) {
    console.error(err);
    res.redirect("/posts");
  }
}

export async function destroyPost(req, res) {
  let { id } = req.params;
  let deletedPost = await Post.findByIdAndDelete(id);
  req.flash("success", "Post deleted");
  res.redirect("/posts");
}
