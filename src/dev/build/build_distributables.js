/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { getConfig, createRunner } from './lib';

import {
  BuildPackagesTask,
  CleanExtraBinScriptsTask,
  CleanExtraBrowsersTask,
  CleanExtraFilesFromModulesTask,
  CleanPackagesTask,
  CleanTypescriptTask,
  CleanNodeBuildsTask,
  CleanTask,
  CopySourceTask,
  CreateArchivesSourcesTask,
  CreateArchivesTask,
  CreateDebPackageTask,
  CreateEmptyDirsAndFilesTask,
  CreateNoticeFileTask,
  CreatePackageJsonTask,
  CreateReadmeTask,
  CreateRpmPackageTask,
  DownloadNodeBuildsTask,
  ExtractNodeBuildsTask,
  InstallDependenciesTask,
  OptimizeBuildTask,
  RemovePackageJsonDepsTask,
  TranspileBabelTask,
  TranspileTypescriptTask,
  TranspileScssTask,
  UpdateLicenseFileTask,
  VerifyEnvTask,
  VerifyExistingNodeBuildsTask,
  WriteShaSumsTask,
} from './tasks';

export async function buildDistributables(options) {
  const {
    log,
    isRelease,
    buildOssDist,
    buildDefaultDist,
    downloadFreshNode,
    createArchives,
    createRpmPackage,
    createDebPackage,
    targetAllPlatforms,
  } = options;

  log.verbose('building distributables with options:', {
    isRelease,
    buildOssDist,
    buildDefaultDist,
    downloadFreshNode,
    createArchives,
    createRpmPackage,
    createDebPackage,
  });

  const config = await getConfig({
    isRelease,
    targetAllPlatforms
  });

  const run = createRunner({
    config,
    log,
    buildOssDist,
    buildDefaultDist,
  });

  /**
   * verify, reset, and initialize the build environment
   */
  await run(VerifyEnvTask);
  await run(CleanTask);
  await run(downloadFreshNode ? DownloadNodeBuildsTask : VerifyExistingNodeBuildsTask);
  await run(ExtractNodeBuildsTask);

  /**
   * run platform-generic build tasks
   */
  await run(CopySourceTask);
  await run(CreateEmptyDirsAndFilesTask);
  await run(CreateReadmeTask);
  await run(TranspileBabelTask);
  await run(TranspileTypescriptTask);
  await run(BuildPackagesTask);
  await run(CreatePackageJsonTask);
  await run(InstallDependenciesTask);
  await run(CleanTypescriptTask);
  await run(CleanPackagesTask);
  await run(CreateNoticeFileTask);
  await run(UpdateLicenseFileTask);
  await run(RemovePackageJsonDepsTask);
  await run(TranspileScssTask);
  await run(CleanExtraFilesFromModulesTask);
  await run(OptimizeBuildTask);

  /**
   * copy generic build outputs into platform-specific build
   * directories and perform platform-specific steps
   */
  await run(CreateArchivesSourcesTask);
  await run(CleanExtraBinScriptsTask);
  await run(CleanExtraBrowsersTask);
  await run(CleanNodeBuildsTask);

  /**
   * package platform-specific builds into archives
   * or os-specific packages in the target directory
   */
  if (createArchives) { // control w/ --skip-archives
    await run(CreateArchivesTask);
  }
  if (createDebPackage) { // control w/ --deb or --skip-os-packages
    await run(CreateDebPackageTask);
  }
  if (createRpmPackage) { // control w/ --rpm or --skip-os-packages
    await run(CreateRpmPackageTask);
  }

  /**
   * finalize artifacts by writing sha1sums of each into the target directory
   */
  await run(WriteShaSumsTask);
}
