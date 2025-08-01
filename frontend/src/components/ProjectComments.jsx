import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("access_token");

function ProjectComments({ projectId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    // Fetch comments
    fetch(`${API_URL}/projects/${projectId}/comments`)
      .then((res) => res.json())
      .then(setComments)
      .catch(() => toast.error("Failed to load comments"));

    // Fetch current user
    fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setCurrentUser)
      .catch(() => console.error("Could not fetch user"));
  }, [projectId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!currentUser?.id) {
      toast.error("User not authenticated");
      return;
    }

    fetch(`${API_URL}/projects/${projectId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ content: newComment, user_id: currentUser.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post comment");
        return res.json();
      })
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
    if (!editedContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    fetch(`${API_URL}/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ content: editedContent }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
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
    fetch(`${API_URL}/comments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
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

