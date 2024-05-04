// Main function processing Prolog text to visualize it
function visualizeProlog(prologText, testTree) {
    let parsedRule = testTree.parsePrologCode(prologText);

    let shapes = [];
    let connections = [];

    // Create main rule shape
    let mainShape = createShape(parsedRule, 0, 520, 203); // Adjusted for centered placement
    shapes.push(mainShape);

    // Check how many sub-rules are present and create shapes and connections accordingly
    if (parsedRule.body.length === 1) {
        // Single sub-rule, create shape and direct connection
        let subShape = createShape(parsedRule.body[0], 1, 696, 415); // Adjusted positions
        shapes.push(subShape);

        // Create direct connection from main rule to the sub-rule
        let connection = createConnection(0, mainShape.id, subShape.id);
        connections.push(connection);
    } else if (parsedRule.body.length > 1) {
        // Multiple sub-rules, implement grouping logic if needed
        let { subShapes, groupShape } = createGroupedSubShapes(parsedRule.body, 561, 296, 145, "AND");
        shapes.push(...subShapes);
        if (groupShape) {
            shapes.push(groupShape);
            // Create connection from main rule to the group
            let connection = createConnection(0, mainShape.id, groupShape.id);
            connections.push(connection);
        }
    }

    // Construct the final page object
    return {
        id: 0,
        name: "Page #0",
        shapes: shapes,
        connections: connections,
        latestViewport: { x: 0, y: 0 }
    };
}

// Helper function to group sub-rule shapes and create a group shape
function createGroupedSubShapes(rules, startX, startY, deltaX, operator="AND") {
    if (rules.length === 0) {
        return { subShapes: [], groupShape: null }; // No sub-rules present
    } else if (rules.length === 1) {
        // Only one sub-rule, return it without creating a group
        let singleShape = createShape(rules[0], 2, startX, startY);
        return { subShapes: [singleShape], groupShape: null };
    } else {
        // Multiple sub-rules, create a group
        let subShapes = rules.map((rule, index) => createShape(rule, index + 2, startX + deltaX * index, startY));
        let groupShape = {
            type: "GroupShape",
            id: 1,
            x: startX - 50, // Adjust group position based on visual requirements
            y: startY - 125,
            data: {
                contained: subShapes.map(shape => shape.id),
                operator: operator,
                width: 300,
                height: 200
            }
        };
        return { subShapes, groupShape };
    }
}

// Function to create a shape for a rule
function createShape(rule, id, x, y) {
    let args = rule.args.map(arg => arg.name);
    return {
        type: "RuleShape",
        id: id,
        x: x,
        y: y,
        data: {
            libraryName: "",
            ruleName: rule.name,
            arguments: args
        }
    };
}

// Function to create connections between shapes
function createConnection(id, sourceId, targetId) {
    return {
        type: "StraightConnection",
        role: "true",
        target: {
            shape: targetId,
            role: "in"
        },
        source: {
            shape: sourceId,
            role: "out"
        },
        id: id
    };
}
