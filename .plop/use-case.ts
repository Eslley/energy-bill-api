import type { NodePlopAPI } from 'plop';

const handlers = {
  http: 'Http',
  schedule: 'Schedule',
};

export default function (plop: NodePlopAPI) {
  plop.setGenerator('Use Case', {
    description: 'Use Case',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your use case name?',
      },
      {
        type: 'checkbox',
        name: 'handlers',
        message: 'Which handler do you want to use?',
        choices: Object.values(handlers),
        default: 'http',
      },
      {
        type: 'list',
        name: 'http.method',
        message: 'Which method do you want to use?',
        choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        when: (answers) => answers.handlers.includes(handlers.http),
      },
      {
        type: 'input',
        name: 'http.path',
        message: 'What is your path?',
        when: (answers) => answers.handlers.includes(handlers.http),
      },
      {
        type: 'input',
        name: 'schedule.cron',
        message: 'What is your cron expression?',
        default: '0 0 * * *',
        when: (answers) => answers.handlers.includes(handlers.schedule),
      },
    ],
    actions: (answers) => {
      const actions = [
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/use-case.ts',
          templateFile: 'templates/use-case.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/dtos.ts',
          templateFile: 'templates/dtos.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/controller.ts',
          templateFile: 'templates/controller.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/errors.ts',
          templateFile: 'templates/errors.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/factory.ts',
          templateFile: 'templates/factory.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/repository.ts',
          templateFile: 'templates/repository.ts.hbs',
          skipIfExists: true,
        },
      ];

      if (answers?.handlers.includes(handlers.http)) {
        actions.push({
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/controller.ts',
          templateFile: 'templates/controller.ts.hbs',
          skipIfExists: true,
        });
      }

      if (answers?.handlers.includes(handlers.schedule)) {
        actions.push({
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/scheduler.ts',
          templateFile: 'templates/scheduler.ts.hbs',
          skipIfExists: true,
        });
      }

      return actions;
    },
  });
}
