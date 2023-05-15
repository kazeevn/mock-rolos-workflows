// To be executed in a JavaScript console in the browser duly authenticated
// Create /mock.sh in the root of the project and make it executable
// Suggested file is in the repository
// It will modify the currently opened project in-place, beware
// NO WARRANTY WHATSOEVER

function mock_current_project() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let project_url = new URL(tabs[0].url);
        const project_id = project_url.pathname.split("/")[2];
        console.log(`Project ${project_id}`);
        mock_project(project_id).then(() => {
            alert("Project mocked!");
            //  document.getElementById('content').innerHTML = "<img src='images/complete.png' alt='Robot jester having fun' width='256px' height='256px'>"; 
            //    chrome.windows.create({'url': 'complete.html', 'type': 'popup'})
        });
    });
    // If not in a extension context, use this instead
    // const project_url = new URL(window.location.href);
}

async function mock_project(project_id) {
    const workflows_response = await fetch(`https://my.rolos.com/api/v1/projects/${project_id}/workflows`, {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "sec-ch-ua": "\"Chromium\";v=\"111\", \"Not(A:Brand\";v=\"8\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
    },
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include",
    });
    const workflows = await workflows_response.json();
    for (const i in workflows['results']) {
        await mock_workflow(workflows['results'][i]['id']);
    };
}

async function mock_workflow(workflow_id) {
    console.log(`Workflow ${workflow_id}`);
    const nodes_response = await fetch(`https://my.rolos.com/api/v1/workflows/${workflow_id}/nodes`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "sec-ch-ua": "\"Chromium\";v=\"111\", \"Not(A:Brand\";v=\"8\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });
    const nodes = await nodes_response.json();
    for (const i in nodes['results']) {
        await mock_node(nodes['results'][i]['id']);
    };
}

async function mock_node(node_id) {
    fetch(`https://my.rolos.com/api/v1/workflows/nodes/${node_id}`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "content-type": "application/json",
          "sec-ch-ua": "\"Chromium\";v=\"111\", \"Not(A:Brand\";v=\"8\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "body": "{\"cpu_count\":2,\"gpu\":false,\"ram\":3,\"type\":\"environment\",\"file_id\":\"/mock.sh\"}",
        "method": "PATCH",
        "mode": "cors",
        "credentials": "include"
      });
};

const button = document.querySelector("button");
button.addEventListener("click", mock_current_project());