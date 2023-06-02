// To be executed in a JavaScript console in the browser duly authenticated
// Create /mock.sh in the root of the project and make it executable
// Suggested file is in the repository
// It will modify the currently opened project in-place, beware
// NO WARRANTY WHATSOEVER

function mock_current_project() {
    c = document.getElementById("script_overwrite");
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let project_url = new URL(tabs[0].url);
        const project_id = project_url.pathname.split("/")[2];
        const api_head = project_url.host;
        console.log(`Project ${project_id}`);
        mock_project(project_id, api_head).then(() => {
            alert("Project mocked!");
            // document.getElementById('content').innerHTML = "<img src='images/complete.png' alt='Robot jester having fun' width='256px' height='256px'>"; 
            // chrome.windows.create({'url': 'complete.html', 'type': 'popup'})
        });
    });
    // If not in a extension context, use this instead
    // const project_url = new URL(window.location.href);
}

async function mock_project(project_id, api_head) {
    const workflows_response = await fetch(`https://${api_head}/api/v1/projects/${project_id}/workflows`, {
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
        await mock_workflow(workflows['results'][i]['id'], api_head);
    };
}

async function mock_workflow(workflow_id, api_head) {
    console.log(`Workflow ${workflow_id}`);
    const nodes_response = await fetch(`https://${api_head}/api/v1/workflows/${workflow_id}/nodes`, {
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
        await mock_node(nodes['results'][i]['id'], api_head);
    };
}

async function mock_node(node_id, api_head) {
    body = {"cpu_count":1, "gpu":false, "ram":2, "type": "environment"};
    const c = document.getElementById("script_overwrite");
    if (c.checked) {
        body['file_id'] = "/mock.sh";
    };
    fetch(`https://${api_head}/api/v1/workflows/nodes/${node_id}`, {
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
        "body": JSON.stringify(body),
        "method": "PATCH",
        "mode": "cors",
        "credentials": "include"
      });
};

button = document.getElementById("start_mocking");
button.addEventListener("click", mock_current_project);