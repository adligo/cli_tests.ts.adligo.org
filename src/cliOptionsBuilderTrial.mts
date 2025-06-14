/**
 *
 *
 * Copyright 2025 Adligo Inc / Scott Morgan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Test, TestParams, TrialSuite, DefaultAssertionContextFactory, DefaultTestResultFactory } from '@ts.adligo.org/tests4ts/dist/tests4ts.mjs';
import { SourceFileTrial } from '@ts.adligo.org/tests4ts/dist/trials.mjs';
import { I_AssertionContext } from '@ts.adligo.org/i_tests4ts/dist/i_tests4ts.mjs';
import { JUnitXmlGenerator } from '@ts.adligo.org/junit-xml-tests4j/dist/junitXmlTests4jGenerator.mjs';
import {CliOptionType, I_CliOption } from
        '@ts.adligo.org/i_cli/dist/i_cli.mjs';
import {CliOption, CliOptionBuilder, CliOptions, CliOptionsBuilder, CommandBuilder, FlagBuilder, KeyValueBuilder } from
        '@ts.adligo.org/cli/dist/cli.mjs';

class CliOptionsBuilderTrial extends SourceFileTrial {
    public static readonly CLAZZ_NAME = 'org.adligo.ts.cli_tests.CliOptionsBuilderTrial';

    public static getEncDecOptions(): CliOptions {
        return new CliOptionsBuilder().set(
            new FlagBuilder('help',
                'This will show the help for the encrypt or decrypt section of the program.', 'h').build()).set(
            new FlagBuilder('debug',
                'This will debug the encrypt or decrypt section of the program.', 'd').build()).set(
            new KeyValueBuilder('f',
                'This is the file to encrypt or decrypt.', 'f').build()).set(
            new KeyValueBuilder('o',
                'This will is the output file name of the file that was encrypted or decrypted.', '0').build()
        ).build();
    }
    public static readonly testBasicUsage = new Test(TestParams.of(
        CliOptionsBuilderTrial.CLAZZ_NAME +
        '.testGenerateXmlBasic'), (ac: I_AssertionContext) => {
        // Create a mock trial with passing tests
        let co: CliOptions = new CliOptionsBuilder().set(
            new FlagBuilder('help',
                'This will show the help.', 'h').build()).set(
            new FlagBuilder('debug',
                'This will debug the program.', 'd').build()).set(
            new KeyValueBuilder('config',
                'This will provide a config file name to the program.', 'c').build()).set(
            new CommandBuilder('enc',
                'This commands the program to encrypt a file.')
                .withOptions(CliOptionsBuilderTrial.getEncDecOptions()).build()).set(
            new CommandBuilder('dec',
                'This commands the program to encrypt a file.')
                .withOptions(CliOptionsBuilderTrial.getEncDecOptions()).build()
        ).build();

        // Verify XML structure
        let topOptionNames = co.getOptions();
        ac.isTrue(topOptionNames.has('help'), "The top level options should have 'help'");
        ac.isTrue(topOptionNames.has('debug'), "The top level options should have 'debug'");
        ac.isTrue(topOptionNames.has('config'), "The top level options should have 'config'");
        ac.isTrue(topOptionNames.has('enc'), "The top level options should have 'enc'");
        ac.isTrue(topOptionNames.has('dec'), "The top level options should have 'dec'");

        let enc: I_CliOption = co.getOption('enc');
        ac.notNull(enc);
        ac.notNull(CliOptionType.Command);
        ac.same(CliOptionType.Command, enc.getType(),"The command 'enc' should be a Command. ")
        //let encOptionNames = enc.get


        let dec: I_CliOption = co.getOption('dec');
        ac.notNull(dec);
    });
    constructor() {
        super(CliOptionsBuilderTrial.CLAZZ_NAME, [
            CliOptionsBuilderTrial.testBasicUsage
        ]);
    }
}


// Run the trial
const trial = new CliOptionsBuilderTrial();
const suite = new TrialSuite('CliOptionsBuilderTrial Tests', [trial]);
suite.run().printTextReport().printTestReportFiles(new JUnitXmlGenerator());
