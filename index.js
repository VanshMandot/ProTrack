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
  cfLastSolved: 'N/A',
  lcLastSolved: 'N/A',
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return `${day}/${month}/${year} ${time}`;
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
    
        if (contestsData.result.length > 0) {
            const lastSubmission = contestsData.result[contestsData.result.length - 1]; 
            const lastSolvedDate = new Date(lastSubmission.creationTimeSeconds * 1000); 
            data.cfLastSolved = `Last Solved: ${formatDate(lastSolvedDate)}`; 
        }
    
        const recentSubmissions = leetcodeData.recentSubmissions;
        const lastSolvedSubmission = recentSubmissions.reverse().find(submission => submission.statusDisplay === "Accepted");
    
        if (lastSolvedSubmission) {
            const lastSolvedTimestamp = lastSolvedSubmission.timestamp;
            const lastSolvedDate = new Date(lastSolvedTimestamp * 1000);
            data.lcLastSolved = `Last Solved: ${formatDate(lastSolvedDate)}`; 
        } else {
            data.lcLastSolved = `Last Solved: N/A`;
        }
    
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
  document.getElementById('cf-date-time').textContent = data.cfLastSolved; 
  document.getElementById('lc-date-time').textContent = data.lcLastSolved; 
};

document.addEventListener('DOMContentLoaded', () => {
  fetchUserData('vmmm');
  updateHTML();
});
