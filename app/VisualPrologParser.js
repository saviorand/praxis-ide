// Main function processing Prolog text to visualize it
function visualizeProlog(prologText, testTree) {
    let parsedRule = testTree.parsePrologCode(prologText);

    let shapes = [];
    let connections = [];

    let mainShape = createShape(parsedRule, 0, 520, 50); // Adjusted for centered placement
    shapes.push(mainShape);

    if (parsedRule.body.length === 1) {
        let subShape = createShape(parsedRule.body[0], 1, 696, 215);
        shapes.push(subShape);
        let connection = createConnection(0, mainShape.id, subShape.id);
        connections.push(connection);
    } else if (parsedRule.body.length > 1) {
        let { subShapes, groupShape } = createGroupedSubShapes(parsedRule.body, 561, 126, 145);
        shapes.push(...subShapes);
        if (groupShape) {
            shapes.push(groupShape);
            let connection = createConnection(0, mainShape.id, groupShape.id);
            connections.push(connection);
        }
    }

    return {
        id: 0,
        name: "Main",
        shapes: shapes,
        connections: connections,
        latestViewport: { x: 0, y: 0 }
    };
}

// Helper function to group sub-rule shapes and create a group shape
function createGroupedSubShapes(rules, startX, startY, deltaX) {
    if (rules.length === 0) {
        return { subShapes: [], groupShape: null };
    }

    let subShapes = [];

    rules.forEach((item, index) => {
        if (item.type === ';') operator = 'OR';
        let shape = createShape(item.content, index + 2, startX + deltaX * index, startY);
        subShapes.push(shape);
    });

    let groupShape = {
        type: "GroupShape",
        id: 1,
        x: startX - 50,
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

function createGroupedSubShapes(rules, startX, startY, deltaX) {
    if (rules.length === 0) {
        return { subShapes: [], groupShape: null }; // No sub-rules present
    } else if (rules.length === 1) {
        let singleShape = createShape(rules[0], 2, startX, startY);
        return { subShapes: [singleShape], groupShape: null };
    } else {
        let operator = 'AND'; // Default operator
        let subShapes = [];

        rules.forEach((rule, index) => {
            if (rule.type === ';') operator = 'OR';
            let shape = createShape(rule, index + 2, startX + deltaX * index, startY);
            subShapes.push(shape);
        });
        let groupShape = {
            type: "GroupShape",
            id: 1,
            x: startX - 50,
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
    let args = [];
    let ruleName = "";
    if (typeof(rule.body) !== 'undefined') {
        args = rule.args.map(arg => arg.name);
        ruleName = rule.name;
    } else {
        args = rule.content.args.map(arg => arg.name);
        ruleName = rule.content.name;
    }
    let shape = {
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
    return shape;
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
