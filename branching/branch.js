class Branch {
    constructor(x, y, angle, length, depth) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.length = length;
        this.depth = depth;
        this.subBranches = [];
    };

    branchOut(max_branch_depth, splits, length_multiplier) {
        if (this.depth < max_branch_depth) {
            if (this.subBranches.length > 0) {
                for (let subBranch of this.subBranches) {
                    subBranch.branchOut(max_branch_depth, splits, length_multiplier);
                }
            } else {
                let subAngle = (PI / (splits + 1));
                let startX = this.x + this.length * sin(this.angle);
                let startY = this.y - this.length * (cos(this.angle));
                for (var i = 1; i <= splits; i++) {
                    this.subBranches.push(
                        new Branch(
                            startX, startY,
                            this.angle + (PI/2) - i * subAngle,
                            length_multiplier * this.length, this.depth + 1)
                    )
                }
            }
        }
    };

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        line(0, 0, 0, -this.length);
        pop();

        for (let subBranch of this.subBranches) {
            subBranch.draw();
        }
    };
}