import type { CrudCategory } from "types";

const INITIAL_CRUD_DATA: CrudCategory[] = [
    {
        "category": "Internal CRUD Test",
        "devurl": "http://localhost:3000",
        "produrl": "",
        "items": [
            {
                "label": "Ping the Tool Server",
                "route": "/ping",
                "methods": "GET",
                "description": "Ping the tool server to check if it is running.",
                "sampleInput": "{}",
                "suggested": [],
                "expectedOutcome": "# You should see the word \"pong\" as a message \n\n{\n  \"message\": \"pong\"\n}"
            },
            {
                "label": "Check Post",
                "route": "/pingpost",
                "methods": "POST",
                "description": "Send a POST request to check if it sending correctly",
                "sampleInput": "{\n   \"data\": \"test\",\n   \"message\": \"test\"\n}",
                "suggested": [
                    {
                        "name": "Customer Data",
                        "urlparams": "",
                        "content": "{\n    \"name\": \"Demo Customer\",\n    \"email\": \"demo@test.com\",\n    \"phone\": \"123456789\",\n    \"icon\": \"test icon\"\n}"
                    }
                ],
                "expectedOutcome": "# Note \nYou should see the mirror of your inputs",
            },
            {
                "label": "Check Stream",
                "route": "/pingstream",
                "methods": "STREAM",
                "description": "Send a stream request to check if it sending correctly",
                "sampleInput": "{ }",
                "suggested": [
                    {
                        "name": "I Wandered Lonely as a Cloud",
                        "urlparams": "?poem=I%20Wandered%20Lonely%20as%20a%20Cloud",
                        "content": "{}"
                    },
                    {
                        "name": "The Sun Has Long Been Set",
                        "urlparams": "?poem=The%20Sun%20Has%20Long%20Been%20Set",
                        "content": "{}"
                    }
                ],
                "expectedOutcome": "# Note \nYou should see the stream of words",
            }
        ]
    }
];

export default INITIAL_CRUD_DATA;
