import React, { useState, useEffect } from 'react';
import api from '../api/config';
import './SubscriptionManager.css';

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: number; // in months
}

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<Partial<Subscription>>({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    features: []
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubscription) {
        await api.put(`/subscriptions/${editingSubscription.id}`, formData);
      } else {
        await api.post('/subscriptions', formData);
      }
      setIsModalVisible(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: 1,
        features: []
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/subscriptions/${id}`);
      fetchSubscriptions();
    } catch (error) {
      console.error('Failed to delete subscription:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value
    }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const features = e.target.value.split('\n').filter(feature => feature.trim());
    setFormData(prev => ({ ...prev, features }));
  };

  return (
    <div className="subscription-manager">
      <div className="header">
        <h2>Subscription Plans</h2>
        <button
          className="add-button"
          onClick={() => {
            setEditingSubscription(null);
            setFormData({
              name: '',
              description: '',
              price: 0,
              duration: 1,
              features: []
            });
            setIsModalVisible(true);
          }}
        >
          Add Subscription
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="subscription-list">
          {subscriptions.map(subscription => (
            <div key={subscription.id} className="subscription-card">
              <div className="subscription-content">
                <h3>{subscription.name}</h3>
                <p>{subscription.description}</p>
                <p className="price">${subscription.price}/month</p>
                <p className="duration">Duration: {subscription.duration} months</p>
                <ul className="features">
                  {subscription.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="subscription-actions">
                <button
                  className="edit-button"
                  onClick={() => {
                    setEditingSubscription(subscription);
                    setFormData(subscription);
                    setIsModalVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(subscription.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingSubscription ? 'Edit Subscription' : 'Add Subscription'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (months)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="features">Features (one per line)</label>
                <textarea
                  id="features"
                  value={formData.features?.join('\n')}
                  onChange={handleFeaturesChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setIsModalVisible(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {editingSubscription ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager; 