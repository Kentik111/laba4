module.exports = (sequelize, Sequelize) => {
    const Courses = sequelize.define("courses", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        public: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: true,
        underscored: true 
    });

    return Courses;
};