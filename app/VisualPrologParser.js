
// Helper function to create individual shapes for rules
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

// Helper function to group sub-rule shapes and create a group shape
function createGroupedSubShapes(rules, startX, startY, deltaX) {
    let subShapes = rules.map((rule, index) => createShape(rule, index + 2, startX + deltaX * index, startY));
    let groupShape = {
        type: "GroupShape",
        id: 1,
        x: startX - 50, // Adjust group position based on visual requirements
        y: startY - 125,
        data: {
            contained: subShapes.map(shape => shape.id),
            operator: "AND",
            width: 300,
            height: 200
        }
    };
    return { subShapes, groupShape };
}

// Helper function to create connections between shapes
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

class VisualPrologParser extends PrologParser {
    constructor(tokens) {
        super(tokens);
        this.shapes = [];
        this.connections = [];
        this.nextShapeId = 0;
        // Extend or override existing parselets here if necessary
        this.overrideParselets();
    }

    overrideParselets() {
        // This will override the TermParselet to add visualization capabilities
        this.registerInfixParselet("(", new VisualTermParselet());
    }

    generateDiagram() {
        try {
            this.parseThis();
        } catch (e) {
            console.error(e);
        }
        return {
            name: "modelName",
            shapes: this.shapes,
            connections: this.connections,
            latestViewport: { x: 0, y: 0 }
        };
    }
}

class VisualTermParselet extends TermParselet {
    parse(parser, left, token) {
        // Call the original TermParselet parse method
        const termExpression = super.parse(parser, left, token);
        console.log(termExpression);

        // Create a visual representation for the term
        const shape = {
            type: "RuleShape",
            id: parser.nextShapeId++,
            x: Math.random() * 800,
            y: Math.random() * 600,
            data: {
                libraryName: "",
                ruleName: termExpression.functor.name,
                arguments: termExpression.args.map(arg => [arg.mLeft.name, arg.mRight.name]).flat()
            }
        };

        parser.shapes.push(shape);
        return shape;
    }
}
