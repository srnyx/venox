package network.venox.cobalt.commands.subcommands.nicknamecmd;

import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.interactions.commands.build.OptionData;

import network.venox.cobalt.command.CoCommand;
import network.venox.cobalt.command.CoSubCommand;
import network.venox.cobalt.commands.subcommands.NicknameCmd;
import network.venox.cobalt.data.CoGuild;
import network.venox.cobalt.events.CoSlashCommandInteractionEvent;

import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.Set;


public class AddCmd extends CoSubCommand {
    public AddCmd(@NotNull CoCommand parent) {
        super(parent);
    }

    @Override @NotNull
    public String description() {
        return "Add a list of phrases to the nickname blacklist";
    }

    @Override @NotNull
    public List<OptionData> options() {
        return List.of(
                new OptionData(OptionType.STRING, "nicknames", "The blacklisted nicknames to add", true),
                new OptionData(OptionType.STRING, "delimiter", "The characters used to separate multiple nicknames", false));
    }

    @Override
    public void onCommand(@NotNull CoSlashCommandInteractionEvent event) {
        final CoGuild guild = event.getCoGuild();
        final Set<String> nicknames = getParent(NicknameCmd.class).getNicknames(event);
        if (guild == null || nicknames == null) return;

        // Add to database
        guild.nicknameBlacklist.addAll(nicknames);

        // Reply
        event.reply("Added `" + nicknames.size() + "` nicknames to the blacklist").setEphemeral(true).queue();
    }
}