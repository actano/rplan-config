# rplan-config

[![Build Status](https://travis-ci.org/actano/rplan-config.svg?branch=master)](https://travis-ci.org/actano/rplan-config)

This is a reusable and stand-alone config module for RPLAN to provide an extensible configuration
for the platform.

The module will try to read its configuration from the `.rplan-config.yml` file. It will search for 
the file starting from the current working directory and traversing upwards in the directory 
hierarchy of the file system until the file is found.

Additionally more config files can be specified as comma separated list in the environment variable 
`RPLAN_ADDITIONAL_CONFIG_FILES`. The configuration of `.rplan-config.yml` and these files will be 
merged together from left to right.

## TODOs
* [ ] create API for easy integration of plugins/third-party code
