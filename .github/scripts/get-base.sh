#!/bin/bash
if [ ! -z $PR_BASE ]; then echo "BASE=$PR_BASE"; else echo "BASE=$MERGE_BASE"; fi