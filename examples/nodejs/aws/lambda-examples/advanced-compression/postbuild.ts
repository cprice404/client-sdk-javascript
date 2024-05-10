import {execSync} from 'child_process';

const functionsDir = 'src';
const commands = [
    'ls -lah',
    `pushd dist/`,
    `echo "zipping ${functionsDir} lambda"`,
    `zip -R function.zip *`,
    `mv function.zip ../`,
    'popd',
];

execSync(commands.join(' && '), {
    stdio: 'inherit',
});
