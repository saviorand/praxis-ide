class InverseParser {
    constructor() {
        this.shapes = [];
        this.connections = [];
        this.nextId = 0;
    }

    parsePrologCode(prologString) {
        const lines = prologString.split('.').map(line => line.trim()).filter(line => line);

        lines.forEach(line => {
            if (line.includes(':-')) {
                const [head, body] = line.split(':-').map(part => part.trim());
                this.parseRule(head, body);
            } else {
                this.parseFact(line);
            }
        });

        return {
            id: 0,
            name: "Root",
            shapes: this.shapes,
            connections: this.connections,
            latestViewport: { x: 0, y: 0 }
        };
    }

    parseRule(head, body) {
        const headParts = this.parsePrologStatement(head);
        const bodyParts = body.split(',').map(part => this.parsePrologStatement(part.trim()));

        const headShape = this.createShape("RuleShape", headParts.name, headParts.args);
        this.shapes.push(headShape);

        const groupShape = this.createGroupShape([headShape.id]);
        this.shapes.push(groupShape);
        this.createConnection(headShape.id, groupShape.id);

        bodyParts.forEach((part, index) => {
            const ruleShape = this.createShape("RuleShape", part.name, part.args);
            this.shapes.push(ruleShape);
            groupShape.data.contained.push(ruleShape.id);
            if (index === 0) {
                this.createConnection(groupShape.id, ruleShape.id, false); // Connection inside group
            }
        });
    }

    parseFact(fact) {
        const factParts = this.parsePrologStatement(fact);
        this.shapes.push(this.createShape("RuleShape", factParts.name, factParts.args));
    }

    parsePrologStatement(statement) {
        const trimmed = statement.trim();
        const firstParen = trimmed.indexOf('(');
        const name = trimmed.substring(0, firstParen);
        const args = trimmed.substring(firstParen + 1, trimmed.lastIndexOf(')')).split(',').map(arg => arg.trim());
        return { name, args };
    }

    createShape(type, ruleName, args) {
        return {
            type,
            id: this.nextId++,
            x: Math.random() * 800, // Placeholder for x position
            y: Math.random() * 600, // Placeholder for y position
            data: {
                libraryName: "",
                ruleName,
                arguments: args
            }
        };
    }

    createGroupShape(contained) {
        return {
            type: "GroupShape",
            id: this.nextId++,
            x: Math.random() * 800, // Placeholder for x position
            y: Math.random() * 600, // Placeholder for y position
            data: {
                contained,
                operator: "AND",
                width: 300,
                height: 200
            }
        };
    }

    createConnection(sourceId, targetId, isIn = true) {
        this.connections.push({
            type: "StraightConnection",
            role: "true",
            source: {
                shape: sourceId,
                role: isIn ? "in" : "out"
            },
            target: {
                shape: targetId,
                role: isIn ? "out" : "in"
            },
            id: this.nextId++
        });
    }
}
