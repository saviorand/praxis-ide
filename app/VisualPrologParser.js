// Main function processing Prolog text to visualize it
function visualizeProlog(prologText, testTree) {
    let parsedProlog = testTree.parsePrologCode(prologText);

    let shapes = [];
    let connections = [];
    let yOffset = 50; // Initial y-offset for placement of the first rule shape
    let currentId = 0; // ID for shapes

    parsedProlog.rules.forEach(rule => {
        let mainShape = createShape(rule, currentId++, 620, yOffset);
        shapes.push(mainShape);

        if (rule.body && rule.body.length === 1) {
            let subShape = createShape(rule.body[0].content, currentId++, 696, yOffset + 165);
            shapes.push(subShape);
            let connection = createConnection(connections.length, mainShape.id, subShape.id);
            connections.push(connection);
        } else if (rule.body && rule.body.length > 1) {
            let { subShapes, groupShape, nextId } = createGroupedSubShapes(rule.body, 561, yOffset + 176, 105, currentId);
            currentId = nextId; // Update currentId with the returned nextId to avoid duplicates
            shapes.push(...subShapes);
            if (groupShape) {
                shapes.push(groupShape);
                let connection = createConnection(connections.length, mainShape.id, groupShape.id);
                connections.push(connection);
            }
        }

        yOffset += 350; // Increment y-offset for the next rule
    });

    return {
        id: 0,
        name: "Main",
        shapes: shapes,
        connections: connections,
        latestViewport: { x: 0, y: 0 }
    };
}
function createGroupedSubShapes(rules, startX, startY, deltaX, startId) {
    let subShapes = [];
    let currentId = startId;
    let operator = 'AND';

    rules.forEach((rule, index) => {
        if (rule.type === ';') operator = 'OR';
        let shape = createShape(rule.content, currentId, startX + deltaX * index, startY);
        subShapes.push(shape);
        currentId++;
    });

    contained = [];
    for (let i = 0; i < subShapes.length; i++) {
        contained.push(subShapes[i].id);
    }

    let groupShape = {
        type: "GroupShape",
        id: currentId,
        x: startX - 50,
        y: startY - 125, 
        data: {
            contained,
            operator: operator,
            width: 100 * subShapes.length,
            height: 200
        }
    };

    return { subShapes, groupShape, nextId: currentId + 1 };
}



// Function to create a shape for a rule
function createShape(rule, id, x, y) {
    let args = [];
    let ruleName = "";

    // Check if 'rule' is structured as expected with 'args' and 'name'
    if (rule.args && rule.name) {
        args = rule.args.map(arg => arg.name);
        ruleName = rule.name;
    } else if (rule.content && rule.content.args && rule.content.name) {
        // Check if 'rule.content' is structured as expected with 'args' and 'name'
        args = rule.content.args.map(arg => arg.name);
        ruleName = rule.content.name;
    }

    return {
        type: "RuleShape",
        id: id,
        x: x,
        y: y,
        data: {
            libraryName: "",
            ruleName: ruleName,
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
