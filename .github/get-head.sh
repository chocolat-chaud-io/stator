#!/bin/bash
if [ ! -z $PR_HEAD ]; then echo "HEAD=$PR_HEAD"; else echo "HEAD=$MERGE_HEAD"; fi