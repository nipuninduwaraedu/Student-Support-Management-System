import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Plus, Trash2, Calendar as CalIcon, Clock } from "lucide-react";
import moment from "moment";

const EAdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    image: null,
  });

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!showModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("time", formData.time);
    if (formData.image) data.append("image", formData.image);

    try {
      await axios.post("http://localhost:5000/api/events", data);
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        image: null,
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to add event: " + (err.response?.data?.msg || err.message));
      console.error(err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Manage Events</h1>
          <p className="subtitle">Add, edit or remove campus events</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Event
        </button>
      </div>

      <div className="card-grid">
        {events.map((event) => (
          <div key={event._id} className="glass-panel event-card">
            <img
              src={`http://localhost:5000${event.imageUrl}`}
              alt={event.title}
              className="event-img"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x180?text=No+Image";
              }}
            />
            <div className="event-content">
              <h3 style={{ marginBottom: "0.5rem" }}>{event.title}</h3>
              <p className="subtitle" style={{ flex: 1, marginBottom: "1rem" }}>
                {event.description.substring(0, 100)}...
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  fontSize: "0.85rem",
                  color: "var(--text-light)",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <CalIcon size={14} />{" "}
                  {moment(event.date).format("MMM Do YYYY")}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Clock size={14} /> {event.time}
                </span>
              </div>
              <button
                className="btn btn-danger"
                style={{ width: "100%", padding: "0.5rem" }}
                onClick={() => handleDelete(event._id)}
              >
                <Trash2 size={16} /> Delete Event
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal &&
        createPortal(
          <div
            className="modal-overlay"
            role="presentation"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-content animate-fade-in"
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
              >
                &times;
              </button>
              <h2 id="event-modal-title" style={{ marginBottom: "1.5rem" }}>
                <CalIcon size={20} /> Add New Event
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Event Title</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Spring Open Day"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    required
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe what the event is about..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  ></textarea>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      max={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      required
                      className="form-input"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Event Image{" "}
                    <span
                      style={{
                        textTransform: "none",
                        fontWeight: 400,
                        color: "var(--text-light)",
                        fontSize: "0.75rem",
                      }}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                  />
                  <span className="form-hint">JPG, PNG or GIF — max 5MB</span>
                </div>
                <button type="submit" className="modal-submit-btn">
                  <CalIcon size={16} /> Create Event
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
export default EAdminEvents;
