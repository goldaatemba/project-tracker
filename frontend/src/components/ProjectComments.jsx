import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
<<<<<<< HEAD
=======
const API_URL = import.meta.env.VITE_API_URL;

>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef

function ProjectComments({ projectId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

<<<<<<< HEAD
  useEffect(() => {
    fetch(`http://localhost:5000/projects/${projectId}/comments`)
=======

  useEffect(() => {
    fetch(`${API_URL}/projects/${projectId}/comments`)
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
      .then((res) => res.json())
      .then(setComments)
      .catch(() => toast.error("Failed to load comments"));

<<<<<<< HEAD
    fetch("http://localhost:5000/me", {
=======
    fetch(`${API_URL}/me`, {
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setCurrentUser)
      .catch(() => console.error("Could not fetch user"));
  }, [projectId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    fetch(`http://localhost:5000/projects/${projectId}/comments`, {
=======
    fetch(`${API_URL}/projects/${projectId}/comments`, {
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then((res) => res.json())
      .then((comment) => {
        setComments((prev) => [...prev, comment]);
        setNewComment("");
        toast.success("Comment added");
      })
      .catch(() => toast.error("Failed to add comment"));
  };

  const handleEdit = (id, content) => {
    setEditingCommentId(id);
    setEditedContent(content);
  };

  const handleSaveEdit = (id) => {
<<<<<<< HEAD
    fetch(`http://localhost:5000/comments/${id}`, {
=======
    fetch(`${API_URL}/comments/${id}`, {
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: editedContent }),
    })
      .then((res) => res.json())
      .then((updatedComment) => {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? updatedComment : c))
        );
        setEditingCommentId(null);
        setEditedContent("");
        toast.success("Comment updated");
      })
      .catch(() => toast.error("Failed to update comment"));
  };

  const handleDelete = (id) => {
<<<<<<< HEAD
    fetch(`http://localhost:5000/comments/${id}`, {
=======
    fetch(`${API_URL}/comments/${id}`, {
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        setComments((prev) => prev.filter((c) => c.id !== id));
        toast.success("Comment deleted");
      })
      .catch(() => toast.error("Failed to delete comment"));
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        💬 Comments
      </h3>

      {comments.length > 0 ? (
        <ul className="space-y-5 mb-8">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              {editingCommentId === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800">{comment.content}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    — {comment.user?.username || "Unknown"} on{" "}
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                  {currentUser &&
                    (currentUser.id === comment.user_id ||
                      currentUser.is_admin) && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() =>
                            handleEdit(comment.id, comment.content)
                          }
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic mb-6">No comments yet.</p>
      )}

      <form
        onSubmit={handleCommentSubmit}
        className="bg-gray-50 p-5 border rounded-xl shadow-sm space-y-4"
      >
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          rows="3"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        ></textarea>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectComments;
