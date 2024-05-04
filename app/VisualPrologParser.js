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
