const data = {
  codeforces: {
      rating: 'N/A',
      QuestionsSolved: 'N/A',
      ContestParticipated: 'N/A',
  },
  leetcode: {
      totalSolved: 'N/A',
      rank: 'N/A',
      easy: 'N/A',
      medium: 'N/A',
      hard: 'N/A',
  },
  lastUpdated: 'N/A'
};

const fetchUserData = async (username) => {
  try {
      const contestsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
      const contestsData = await contestsResponse.json();
  
      const ratingResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
      const ratingData = await ratingResponse.json();

      const leetcodeResponse = await fetch('https://leetcode-api-faisalshohag.vercel.app/v_m_m');
      const leetcodeData = await leetcodeResponse.json();

      // Update LeetCode data
      data.leetcode.totalSolved = leetcodeData.totalSolved;
      data.leetcode.rank = leetcodeData.ranking;
      data.leetcode.easy = leetcodeData.easySolved;
      data.leetcode.medium = leetcodeData.mediumSolved;
      data.leetcode.hard = leetcodeData.hardSolved;

      if (contestsData.status === 'OK' && ratingData.status === 'OK') {
          const contests = new Set(contestsData.result.map(submission => submission.contestId));
          const problemsSolved = new Set(contestsData.result.map(submission => `${submission.contestId}-${submission.problem.index}`));
          const rating = ratingData.result[0].rating;

          data.codeforces.rating = rating;
          data.codeforces.QuestionsSolved = problemsSolved.size; 
          data.codeforces.ContestParticipated = contests.size;

          data.lastUpdated = new Date().toLocaleString();

          updateHTML();
      } else {
          console.log('Error fetching user data:', contestsData.comment || ratingData.comment);
      }
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
};

const updateHTML = () => {
  document.getElementById('cf-rating').textContent = data.codeforces.rating;
  document.getElementById('cf-questions-solved').textContent = data.codeforces.QuestionsSolved; 
  document.getElementById('cf-contests-participated').textContent = data.codeforces.ContestParticipated; 
  document.getElementById('lc-rank').textContent = data.leetcode.rank; 
  document.getElementById('lc-questions-solved').textContent = data.leetcode.totalSolved; 
  document.getElementById('lc-easy-solved').textContent = data.leetcode.easy;
  document.getElementById('lc-medium-solved').textContent = data.leetcode.medium; 
  document.getElementById('lc-hard-solved').textContent = data.leetcode.hard; 
  document.getElementById('date-time').textContent = data.lastUpdated; 
};

document.addEventListener('DOMContentLoaded', () => {
  fetchUserData('vmmm');
  updateHTML();
});
