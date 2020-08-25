import { Sequelize, DataTypes } from 'sequelize';
import Hapi from 'hapi';

let sequelize = new Sequelize({
    host: '192.168.1.158',
    database: 'Content',
    dialect: 'mssql',
    username: 'sa',
    password: 'sasa',
    port: 1433,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

let topicModel = sequelize.define("Topic", {
    topicSurrogateId: {
        type: DataTypes.INTEGER,
        field: "TopicSurrogateId",
        primaryKey: true
    },
    topicId: {
        type: DataTypes.STRING,
        field: "TopicId"
    },
    title: {
        type: DataTypes.STRING,
        field: "Title"
    },
    localization: {
        type: DataTypes.STRING,
        field: "Localization"
    },
    topicTypeId: {
        type: DataTypes.STRING,
        field: "TopicTypeId"
    },
    visibilityId: {
        type: DataTypes.STRING,
        field: "VisibilityId"
    },
    moduleTypeId: {
        type: DataTypes.STRING,
        field: "ModuleTypeId"
    },
}, {
    freezeTableName: true,
    timestamps: false
}).schema('Structured');

type Topic = {
    topicSurrogateId: number,
    topicId: string,
    title: string,
    localization: string,
    topicTypeId: string,
    visibilityId: string,
    moduleTypeId: string
};

type TopicCollection = {
    topics: Topic[],
    pagination: {
        skip: number,
        top: number,
        count: number
    }
}

async function getTopics(skip: number = 0, top: number = 0): Promise<[Topic[], number]> {
    var result = await topicModel.findAndCountAll({ limit: top, offset: skip });
    return [result.rows.map(r => r.get({ plain: true }) as Topic), result.count];
}

const server = new Hapi.Server({
    port: 9090,
    host: 'localhost',
    routes: {
        cors: {
            origin: ['*']
        }
    }
});

function toNumber(queryStringParameter: string | string[]): number | null {
    return typeof queryStringParameter === "string"
        ? parseInt(queryStringParameter as string)
        : null;
}

server.route({
    method: 'GET',
    path: '/topics',
    handler: async function (request, h): Promise<TopicCollection> {
        const skip = toNumber(request.query.skip) ?? 0;
        const top = toNumber(request.query.top) ?? 10;

        const [topics, count] = await getTopics(skip, top);

        return {
            topics: topics,
            pagination: {
                skip,
                top,
                count: count
            }
        }
    }
});

const init = async () => {

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
