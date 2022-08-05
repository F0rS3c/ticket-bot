let hastebin = require('hastebin');
// const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {

     

          // client.on('interactionCreate', async interaction => {
          //   if (!interaction.isChatInputCommand()) return;
          
          
          //     const modal = new ModalBuilder()
          //       .setCustomId('myModal')
          //       .setTitle('My Modal');
          
          //     // Add components to modal
          
          //     // Create the text input components
          //     const name = new TextInputBuilder()
          //       .setCustomId('name')
          //         // The label is the prompt the user sees for this input
          //       .setLabel("What's your full name?")
          //       .setStyle(TextInputStyle.Short);
          
              
          
      
          //     // so you need one action row per text input.
          //     const firstActionRow = new ActionRowBuilder().addComponents(name);
        
          
          //     // Add inputs to the modal
          //     modal.addComponents(firstActionRow);
          
          //     // Show the modal to the user
          //     await interaction.showModal(modal);
            
          // });

      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'you already bought a Ticket!',
          ephemeral: true
        });
      };

      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        parent: client.config.parentOpened,
        topic: interaction.user.id,
        permissionOverwrites: [{
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
          },
          {
            id: client.config.roleSupport,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: 'text',
      }).then(async c => {
       

        const embed = new client.discord.MessageEmbed()
          .setColor('ff9600')
          .setAuthor('Type', ' ')
          .setDescription('choose the type of ticket')
          .setFooter('Ticket System', ' ')
          .setTimestamp();

          

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('choose the type of ticket')
            .addOptions([
              {
                label: 'Normal',
                value: 'Normal [10$]',
                emoji: { name: '👠' }
              },
              {
                label: 'Pool',
                value: 'Pool [30$]',
                img :'https://i.imgur.com/nFtzzCC.png' ,
                emoji: { name: '👙' }
              },
              {
                label: 'Vip',
                value: 'Vip [20$]',
             
                emoji: { name: '🛡️' }
              },
              {
                label: 'Premium',
                value: 'Premium [50$]',
                emoji: { name: '💎' }
              },
            ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 20000
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                let img
                if (i.values[0] == 'Normal [10$]') {
                   img = 'https://img.freepik.com/free-photo/friends-clinking-drink-glasses-modern-bar_1150-18971.jpg'
                };
                if (i.values[0] == 'Pool [30$]') {
                  img = 'https://i.imgur.com/nFtzzCC.png'
                };
                if (i.values[0] == 'Vip [20$]') {
                  img = 'https://cdn.discordapp.com/attachments/661164237917257728/1005142895935897627/pngwing.com.png'
                };
                if (i.values[0] == 'Premium [50$]') {
                  img = 'https://cdn.discordapp.com/attachments/661164237917257728/1005147810972315739/SeekPng.com_golden-ticket-png_1000957.png'
                };
                
                const embed = new client.discord.MessageEmbed()
                  .setColor('ff9600')
                  .setAuthor('Ticket', ' ')
                  .setDescription(`<@!${interaction.user.id}> Bought **${i.values[0]}**  Ticket・ `)
                  // .setImage(`${img}`)
                  .setTimestamp();
                 

                  const l24 = new client.discord.MessageEmbed()
                  .setColor('2dff00')
                  .setAuthor('Limit 24h', ' ')
                  .setDescription(`<@!${interaction.user.id}> Bought **${i.values[0]}**  Ticket・ `)
                  .setTimestamp();

                  const usr = new client.discord.MessageEmbed()
                  .setColor('ff9600')
                  .setAuthor('Ticket', ' ')
                  .setDescription(`Thank you for reservation !! you are bought **${i.values[0]}**  Ticket `)
                  .setImage(`${img}`)
                  .setTimestamp();
                  


           
            
                const opened = await client.channels.cache.get(client.config.logsTicket).send({
                  content: `<@&${client.config.roleSupport}>`,
                  embeds: [embed],
                  
                }) 
                .then(msg => {
                  setTimeout(() => msg.delete(), 43200000 )
                });
                let openedq = await client.channels.cache.get(client.config.logs).send({
                 
                  embeds: [l24],
                  
                })             
                .then(msg => {
                  setTimeout(() => msg.delete(), 43200000 )
                });

                

                client.users.cache.get(interaction.user.id).send({
                 
                  embeds: [usr],
                  
                })     
                .then(msg => {
                  setTimeout(() => msg.delete(), 43200000 )
                });
                


                c.delete();


               
          
              });
            };
      

          };
        });

        collector.on('end', collected => {
          if (collected.size < 1) {
            c.send(`There is no selected type.`).then(() => {
              setTimeout(() => {
                
                  c.delete();
              
              }, 5000);
            });
          };
        });
      });
    };


  },
};
