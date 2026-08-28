import { computed, ref } from 'vue';
import { getCommunityApiUrl } from 'src/services/communityApi';

/* ===========================================================
   ESTADO COMPARTILHADO DA VOTAÇÃO E DOS RELATOS

   Voto e resolução de problemas vivem em seções diferentes,
   mas reutilizam identidade, API e dados já salvos no navegador.
=========================================================== */

const VOTER_STORAGE_KEY = '13calendar-reference-feedback-voter';
const feedbackUrl = getCommunityApiUrl('feedback/votes');
const votes = ref([0, 0, 0, 0]);
const userVote = ref(null);
const responseTitle = ref('');
const suggestion = ref('');
const voteAttributionMode = ref('anonymous');
const responseAttributionMode = ref('anonymous');
const voteLinkedProfileName = ref('');
const responseLinkedProfileName = ref('');
const hasSavedResponse = ref(false);
const loadState = ref('idle');
let loadPromise = null;
let voterId = '';

function readOrCreateVoterId() {
  if (voterId) return voterId;

  try {
    const savedId = localStorage.getItem(VOTER_STORAGE_KEY);
    if (savedId) {
      voterId = savedId;
      return voterId;
    }

    voterId = crypto.randomUUID().replaceAll('-', '');
    localStorage.setItem(VOTER_STORAGE_KEY, voterId);
  } catch {
    voterId = crypto.randomUUID().replaceAll('-', '');
  }

  return voterId;
}

function applyPayload(payload) {
  if (Array.isArray(payload?.votes) && payload.votes.length === 4) {
    votes.value = payload.votes.map((count) => Number(count) || 0);
  }

  userVote.value = Number.isInteger(payload?.userVote) ? payload.userVote : null;

  if (!payload?.submission) {
    hasSavedResponse.value = false;
    return;
  }

  responseTitle.value = String(payload.submission.title || '');
  suggestion.value = String(payload.submission.suggestion || '');
  hasSavedResponse.value = Boolean(suggestion.value.trim());
  voteAttributionMode.value =
    payload.submission.voteAttributionMode === 'community' ? 'community' : 'anonymous';
  responseAttributionMode.value =
    payload.submission.responseAttributionMode === 'community' ? 'community' : 'anonymous';
  voteLinkedProfileName.value = String(payload.submission.voteCommunityProfileName || '');
  responseLinkedProfileName.value = String(
    payload.submission.responseCommunityProfileName || '',
  );
}

async function loadFeedback() {
  if (loadState.value === 'ready') return;
  if (loadPromise) return loadPromise;

  if (!feedbackUrl) {
    loadState.value = 'unavailable';
    return;
  }

  loadState.value = 'loading';
  loadPromise = (async () => {
    try {
      const query = new URLSearchParams({ voterId: readOrCreateVoterId() });
      const response = await fetch(`${feedbackUrl}?${query}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`feedback_load_${response.status}`);
      applyPayload(await response.json());
      loadState.value = 'ready';
    } catch {
      loadState.value = 'error';
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}

async function saveFeedback(payload) {
  if (!feedbackUrl) return { ok: false, error: 'unavailable' };

  try {
    const response = await fetch(feedbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        voterId: readOrCreateVoterId(),
      }),
    });
    const responsePayload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { ok: false, error: responsePayload?.error || `feedback_save_${response.status}` };
    }

    applyPayload(responsePayload);
    loadState.value = 'ready';
    return { ok: true };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}

export function useEducationFeedbackStore() {
  return {
    feedbackUrl,
    votes,
    userVote,
    responseTitle,
    suggestion,
    voteAttributionMode,
    responseAttributionMode,
    voteLinkedProfileName,
    responseLinkedProfileName,
    hasSavedResponse,
    loadState,
    loading: computed(() => loadState.value === 'idle' || loadState.value === 'loading'),
    totalVotes: computed(() => votes.value.reduce((sum, count) => sum + count, 0)),
    loadFeedback,
    saveFeedback,
  };
}
