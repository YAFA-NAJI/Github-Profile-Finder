document.addEventListener('DOMContentLoaded', function() {
    const user_img = document.querySelector(".user_img img");
    const userName = document.querySelector(".user_name h1");
    const loginName = document.querySelector(".user_name h3");
    const followers_ = document.querySelector(".followers_ span");
    const follow_ = document.querySelector(".follow_ span");
    const repo_details = document.querySelector(".repo_details");
    const btn_submit = document.querySelector(".btn_submit");
    const input_user = document.querySelector(".input_user");

    // Automatically load data when the page loads
    fetchUserData('YAFA-NAJI');

    // Search event when the button is clicked
    btn_submit.addEventListener("click", function() {
        const username = input_user.value.trim();
        if (username) {
            fetchUserData(username);
        }
    });

    // Search event when Enter key is pressed
    input_user.addEventListener("keyup", function(e) {
        if (e.key === 'Enter') {
            const username = input_user.value.trim();
            if (username) {
                fetchUserData(username);
            }
        }
    });

    // Function to fetch user data
    function fetchUserData(username) {
        // Show loading status
        repo_details.innerHTML = '<div class="loading">Loading repositories...</div>';

        // Fetch user data
        fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then(userData => {
                // Update UI with user data
                user_img.src = userData.avatar_url;
                loginName.textContent = 'Login Name';
                userName.textContent = userData.name || userData.login;
                followers_.textContent = userData.followers;
                follow_.textContent = userData.following;

                // Fetch repositories after successfully fetching user data
                fetchReposData(username);
            })
            .catch(error => {
                console.error('Error:', error);
                repo_details.innerHTML = `<div class="error">${error.message}</div>`;
            });
    }

    // Function to fetch repositories
    function fetchReposData(username) {
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load repositories');
                }
                return response.json();
            })
            .then(repos => {
                if (repos.length === 0) {
                    repo_details.innerHTML = '<div class="item_">No repositories found</div>';
                    return;
                }

                // Create HTML for repositories
                const reposHTML = repos.map(repo => `
                    <div class="item_">
                        <div class="repo_name">
                            <a href="${repo.html_url}" target="_blank" title="${repo.description || 'No description'}">
                                ${repo.name}
                            </a>
                        </div>
                        <div class="repo_details_">
                            <div class="info_ star">
                                <i class="fa fa-star"></i> ${repo.stargazers_count}
                            </div>
                            <div class="info_ fork">
                                <i class="fa fa-code-fork"></i> ${repo.forks_count}
                            </div>
                            <div class="info_ size">
                                <i class="fa fa-file-code-o"></i> ${repo.size} KB
                            </div>
                        </div>
                    </div>
                `).join('');

                repo_details.innerHTML = reposHTML;
            })
            .catch(error => {
                console.error('Error:', error);
                repo_details.innerHTML = `<div class="error">Failed to load repositories</div>`;
            });
    }
});
