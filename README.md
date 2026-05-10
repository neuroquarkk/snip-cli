# snip-cli

- A terminal client for [snip](https://github.com/neuroquarkk/snip-backend)
- Store, retriever and manage code snippets from the command line
- Runs in two modes: interactive **REPL** and non-interactive **CLI**

---

## Installation

```bash
git clone https://github.com/neuroquarkk/snip-cli
cd snip
bun install
bun run build
```

---

## Configuration

By default the client points to `http://localhost:8080/api/v1` which you can override using

```bash
export BASE_URL=https://your-backend.com/api/v1
```

The PAT is stored in `.sniprc` with the `600` permissions

---

## Usage

### REPL Mode

```bash
snip
```

Starts an interactive session with tab-completion on command names. The prompt changes to `[snip]>>` when you are authenticated

```
>> login
[snip]>> touch
[snip]>> ls
```

### CLI Mode

Pass a command directly as an argument for non interactive use

```bash
snip touch ./my-script.sh # create snippet from file
snip view my-alias        # print snippet content to stdout
```

CLI mode verifies your sssion before running the command. If the session is invalid you will be prompted to log in again

---

## Commands

### Authentication

#### `register`

Create a new account. Prompts for email and password

```
>> register
Enter email: user@example.com
Enter password: ········
Registration successful
```

#### `login`

Authenticate and save a Personal Access Token to `.sniprc`

```
>> login
Enter email: user@example.com
Enter password: ········
Login successful
```

#### `logout`

Revoke the PAT on the server and delete `.sniprc`.

```
>> logout
Logout successful
```

### Snippets

#### `touch`

Create a new snippet. Always prompts for title and alias. Content input depends on the mode:

- **REPL**: prompts for multiline content. Type `EOF` on an empty line to finish
- **CLI with file**: reads content from the file path provided

```
# REPL
[snip]>> touch
Enter title: My Script
Enter alias: my-script
Enter content:  (Type EOF on an empty line and press enter)
> #!/bin/bash
> echo "hello"
> EOF
Snippet created successfully

# CLI
bun start touch ./my-script.sh
Enter title: My Script
Enter alias: my-script
Snippet created successfully
```

#### `view [alias=<name>]`

Print a snippet's content to stdout

```
# interactive - prompts for alias
[snip]>> view

# inline argument
[snip]>> view alias=my-script

# CLI mode
bun start view my-script
```

#### `ls [page=<n>] [limit=<n>] [search=<keyword>]`

List snippets. Without arguments, prompts for an optional search keyword and uses defaults (`page=1`, `limit=10`)

```
# default
[snip]>> ls

# with args
[snip]>> ls page=2 limit=5 search=bash

Output:
 1. My Script                       my-script
 2. Docker Compose Boilerplate      docker-compose
```

#### `edit`

Update an existing snippet interactively. Prompts for the current alias then for each field to update (all optional). Content update is opt-in, you are asked `Update content? (y/n)` before the multiline prompt

```
[snip]>> edit
Enter alias to update: my-script
Enter new title (optional):
Enter new alias (optional): renamed-script
Update content? (y/n): n
Snippet updated successfully
```

Only fields with a non-empty response are sent, passing nothing skips that field

#### `rm [alias=<name>]`

Delete a snippet by alias

```
# interactive
[snip]>> rm

# inline argument
[snip]>> rm alias=my-script
```

---

## Argument Format

Commands that accept inline arguments use `key=value` pairs separated by space

```
ls page=2 limit=5 search=bash
view alias=my-script
rm alias=my-script
```

Keys and values must be non-empty. Any argument that does not contain `=` is rejected with an error

---

## Session Behavior

On startup (both REPL and CLI mode), the client reads `.sniprc` and verifies the stored PAT against the backend:

- ** Valid PAT:** session is restored
- ** Invalid PAT:** `.sniprc` is deleted and you are notified to log in again
- ** Server unreachable:** the PAT is loaded from .sniprc without verification and `Server offline` is printed

The prompt reflects auth state:

```
>>        # not authenticated
[snip]>>  # authenticated
```

---

## Backend

Source and setup instructions for the snip API server: [snip-backend](https://github.com/neuroquarkk/snip-backend)
