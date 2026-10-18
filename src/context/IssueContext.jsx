import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { issueService } from '../services/issueService';
import { useAuth } from './AuthContext';

const IssueContext = createContext();

const POLL_INTERVAL = 5000;

export const IssueProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const commentsCache = useRef(new Map());

  const fetchIssues = useCallback(async (opts = {}) => {
    const { silent = false } = opts;
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await issueService.getIssues();
      setIssues(prev => {
        const cache = commentsCache.current;
        // Preserve already-loaded comment threads across poll refreshes
        return data.map(item => {
          const cached = cache.get(item.id);
          if (cached && cached.length > 0) {
            return { ...item, comments: cached };
          }
          return item;
        });
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch issues');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch on load
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Real-time polling while signed in
  useEffect(() => {
    if (!currentUser) return;
    const timer = setInterval(() => fetchIssues({ silent: true }), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [currentUser, fetchIssues]);

  const getIssueById = useCallback((id) => {
    const issue = issues.find(i => i.id === id) || null;
    if (issue && (!issue.comments || issue.comments.length === 0)) {
      issueService.getIssueComments(id).then((comments) => {
        commentsCache.current.set(id, comments);
        setIssues(prev => prev.map(i => i.id === id ? { ...i, comments } : i));
      }).catch(() => {});
    } else if (issue) {
      return { ...issue, comments: commentsCache.current.get(id) || issue.comments || [] };
    }
    return issue;
  }, [issues]);

  const createIssue = async (issueData) => {
    if (!currentUser) throw new Error('Must be logged in to report an issue');
    setLoading(true);
    try {
      const newIssue = await issueService.createIssue(issueData, currentUser);
      setIssues(prev => [newIssue, ...prev]);
      return newIssue;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (id, status) => {
    setLoading(true);
    try {
      const updated = await issueService.updateIssueStatus(id, status);
      setIssues(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignDepartment = async (id, department) => {
    setLoading(true);
    try {
      const updated = await issueService.assignDepartment(id, department);
      setIssues(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setPriority = async (id, priority) => {
    setLoading(true);
    try {
      const updated = await issueService.setPriority(id, priority);
      setIssues(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (id, text) => {
    if (!currentUser) throw new Error('Must be logged in to comment');
    try {
      const updated = await issueService.addComment(id, currentUser.name, text);
      commentsCache.current.set(id, updated.comments || []);
      setIssues(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const submitFeedback = async (id, rating, comment) => {
    setLoading(true);
    try {
      const updated = await issueService.submitFeedback(id, rating, comment);
      setIssues(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <IssueContext.Provider value={{
      issues,
      loading,
      refreshing,
      error,
      lastUpdated,
      fetchIssues,
      getIssueById,
      createIssue,
      updateIssueStatus,
      assignDepartment,
      setPriority,
      addComment,
      submitFeedback
    }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};