// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  async fetchData(page, status, sortBy, sortOrder) {
    const response = await fetch(
      `${API_BASE_URL}/data?page=${page}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  async getReplicationStatus() {
    const response = await fetch(`${API_BASE_URL}/replication/status`);
    if (!response.ok) {
      throw new Error('Failed to get replication status');
    }
    return response.json();
  },

  async startReplication() {
    const response = await fetch(`${API_BASE_URL}/replication/start`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to start replication');
    }
    return response.json();
  },

  async createData(data) {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create data');
    }
    return response.json();
  },

  async updateData(id, data) {
    const response = await fetch(`${API_BASE_URL}/data/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update data');
    }
    return response.json();
  }
};